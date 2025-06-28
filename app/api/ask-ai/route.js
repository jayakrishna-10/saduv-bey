// app/api/ask-ai/route.js
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const model = 'gemini-2.5-pro';
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

// Rate limiting storage (in production, use Redis or database)
const rateLimits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 20; // Max 20 requests per minute for AI

  const userRequests = rateLimits.get(ip) || [];
  const validRequests = userRequests.filter(time => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }
  
  validRequests.push(now);
  rateLimits.set(ip, validRequests);
  return false;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before asking again.' }, 
        { status: 429 }
      );
    }

    const { message, context } = await request.json();
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Build context-aware prompt
    let systemPrompt = `You are AskAI, a helpful assistant for NCE (National Certification Examination for Energy Managers and Energy Auditors) preparation. You should:

1. Provide accurate, concise answers related to energy management and auditing
2. Focus on NCE exam topics: Energy Management, Thermal Utilities, Electrical Utilities
3. Give practical examples when possible
4. Keep answers focused and exam-relevant
5. If asked about specific questions, explain concepts rather than just giving answers

`;

    // Add context information
    if (context) {
      if (context.currentPage) {
        systemPrompt += `Current page: ${context.currentPage}\n`;
      }
      if (context.currentQuestion) {
        systemPrompt += `Current question context: "${context.currentQuestion}"\n`;
      }
      if (context.currentChapter) {
        systemPrompt += `Current chapter: ${context.currentChapter}\n`;
      }
      if (context.paper) {
        systemPrompt += `Current paper: ${context.paper}\n`;
      }
      if (context.additionalContext) {
        systemPrompt += `Additional context: ${context.additionalContext}\n`;
      }
    }

    systemPrompt += `\nUser question: ${message}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: systemPrompt
            },
          ]
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        responseMimeType: 'text/plain',
      },
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' }, 
        { status: 500 }
      );
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini response format:', data);
      return NextResponse.json(
        { error: 'Invalid response from AI service' }, 
        { status: 500 }
      );
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AskAI API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
