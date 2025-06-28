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

    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long. Please keep it under 500 characters.' }, { status: 400 });
    }

    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Build context-aware prompt
    let systemPrompt = `You are AskAI, a helpful assistant for NCE (National Certification Examination for Energy Managers and Energy Auditors) preparation. 

Guidelines:
- Provide accurate, concise answers (max 300 words)
- Focus on NCE exam topics: Energy Management, Thermal Utilities, Electrical Utilities
- Give practical examples when possible
- Keep answers focused and exam-relevant
- If asked about specific questions, explain concepts rather than just giving answers

`;

    // Add context information
    if (context) {
      if (context.currentPage) {
        systemPrompt += `Current page: ${context.currentPage}\n`;
      }
      if (context.currentQuestion) {
        systemPrompt += `Current question context: "${context.currentQuestion.substring(0, 150)}..."\n`;
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

    systemPrompt += `\nUser question: ${message}

Provide a helpful, concise response focused on NCE preparation.`;

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
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 512,
        responseMimeType: 'text/plain',
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(25000), // 25 second timeout
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      
      // Return helpful fallback responses for common scenarios
      if (response.status === 429) {
        return NextResponse.json({ error: 'AI service is busy. Please try again in a moment.' }, { status: 429 });
      }
      
      if (response.status >= 500) {
        return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again later.' }, { status: 503 });
      }
      
      return NextResponse.json({ error: 'AI service error. Please try rephrasing your question.' }, { status: 500 });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      console.error('Unexpected Gemini response format:', data);
      
      // Provide a helpful fallback response
      return NextResponse.json({
        response: "I'm having trouble generating a response right now. For NCE preparation, I recommend reviewing the key topics: Energy Management principles, Thermal Utilities (boilers, steam systems), and Electrical Utilities (motors, lighting, power factor). Try asking a more specific question about these topics.",
        timestamp: new Date().toISOString()
      });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AskAI API error:', error);
    
    // Handle different types of errors with appropriate JSON responses
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Please try asking a shorter question.' }, 
        { status: 408 }
      );
    }
    
    if (error.message?.includes('fetch')) {
      return NextResponse.json(
        { error: 'Unable to connect to AI service. Please try again.' }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Something went wrong. Please try again in a moment.' }, 
      { status: 500 }
    );
  }
}
