// app/api/ask-ai/route.js
import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const model = 'gemini-2.5-pro'; // Back to reasoning model for best quality
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
      console.error('❌ GEMINI_API_KEY not configured');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 });
    }

    // Build context-aware prompt with full details
    let systemPrompt = `You are AskAI, an expert NCE (National Certification Examination for Energy Managers and Energy Auditors) preparation assistant. 

Provide accurate, helpful answers about:
- Energy Management and Audit principles
- Thermal Utilities (boilers, steam systems, furnaces, heat recovery)
- Electrical Utilities (motors, lighting, power factor, HVAC)

`;

    // Add comprehensive context information
    if (context?.currentQuestion) {
      systemPrompt += `CURRENT QUESTION: "${context.currentQuestion}"\n`;
    }
    
    if (context?.questionOptions) {
      systemPrompt += `\nQUESTION OPTIONS:\n${context.questionOptions}\n`;
    }
    
    if (context?.currentChapter) {
      systemPrompt += `TOPIC/CHAPTER: ${context.currentChapter}\n`;
    }
    
    if (context?.paper) {
      systemPrompt += `CONTEXT: User is on ${context.paper} page\n`;
    }

    systemPrompt += `\nUSER QUESTION: ${message}\n\nProvide a comprehensive, accurate response. If this relates to the current question, explain the concept clearly and help with understanding rather than just giving the answer:`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 5000,
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
      signal: AbortSignal.timeout(8000), // 8 second timeout for Vercel
    };

    const response = await fetch(url, options);
    
    console.log('📡 Gemini response status:', response.status);
    console.log('📡 Gemini response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Gemini API error:', response.status, errorData);
      
      // Return helpful fallback responses for common scenarios
      if (response.status === 429) {
        return NextResponse.json({ error: 'AI service is busy. Please try again in a moment.' }, { status: 429 });
      }
      
      if (response.status >= 500) {
        return NextResponse.json({ error: 'AI service temporarily unavailable. Please try again later.' }, { status: 503 });
      }
      
      return NextResponse.json({ error: `Gemini API error ${response.status}: ${errorData}` }, { status: 500 });
    }

    const data = await response.json();
    
    console.log('📋 Raw Gemini response:', JSON.stringify(data, null, 2));
    
    // Check if response was blocked by safety filters
    if (data.candidates && data.candidates[0] && data.candidates[0].finishReason) {
      console.log('🛡️ Finish reason:', data.candidates[0].finishReason);
      if (data.candidates[0].finishReason === 'SAFETY') {
        console.log('🚫 Response blocked by safety filters');
        return NextResponse.json({
          response: "I apologize, but I couldn't generate a response for that question due to content filters. Please try rephrasing your question about NCE topics.",
          timestamp: new Date().toISOString()
        });
      }
      if (data.candidates[0].finishReason === 'MAX_TOKENS') {
        console.log('⚠️ Response was truncated due to token limit');
      }
    }
    
    // Check for content existence with better error handling
    if (!data.candidates || !data.candidates[0]) {
      console.error('❌ No candidates in response');
      return NextResponse.json({
        response: `🔧 DEBUG: No candidates found. Full response: ${JSON.stringify(data)}`,
        timestamp: new Date().toISOString()
      });
    }

    const candidate = data.candidates[0];
    if (!candidate.content) {
      console.error('❌ No content in candidate');
      return NextResponse.json({
        response: `🔧 DEBUG: No content in candidate. Candidate: ${JSON.stringify(candidate)}`,
        timestamp: new Date().toISOString()
      });
    }

    if (!candidate.content.parts || !candidate.content.parts[0]) {
      console.error('❌ No parts in content');
      return NextResponse.json({
        response: `🔧 DEBUG: No parts in content. Content: ${JSON.stringify(candidate.content)}`,
        timestamp: new Date().toISOString()
      });
    }

    const aiResponse = candidate.content.parts[0].text;
    
    if (!aiResponse) {
      console.error('❌ No text in parts[0]');
      return NextResponse.json({
        response: `🔧 DEBUG: No text in parts[0]. Parts[0]: ${JSON.stringify(candidate.content.parts[0])}`,
        timestamp: new Date().toISOString()
      });
    }
    console.log('✅ AI response generated successfully, length:', aiResponse.length);

    // Add note if response was truncated
    let finalResponse = aiResponse;
    if (data.candidates[0].finishReason === 'MAX_TOKENS') {
      finalResponse += '\n\n[Note: Response was truncated due to length. Ask for specific parts if you need more details.]';
    }

    return NextResponse.json({
      response: finalResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AskAI API error:', error.message);
    
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
      { error: `Unexpected error: ${error.message}` }, 
      { status: 500 }
    );
  }
}
