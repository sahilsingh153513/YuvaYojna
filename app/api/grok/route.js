// app/api/grok/route.js (for App Router)
// OR pages/api/grok.js (for Pages Router)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request) {
  try {
    const { message, messages = [] } = await request.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return Response.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Build conversation history
    const conversationMessages = [
      {
        role: 'system',
        content: 'You are Grok, a helpful AI assistant created by xAI. Be helpful, informative, and engaging.'
      },
      ...messages,
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API with CURRENT working model
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // ✅ CURRENT WORKING MODEL (Dec 2024)
        // Alternative models: 'llama-3.1-8b-instant', 'gemma2-9b-it'
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      return Response.json(
        { error: 'Failed to get response from Grok' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return Response.json({
      message: data.choices[0].message.content,
      usage: data.usage
    });

  } catch (error) {
    console.error('API Route Error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
