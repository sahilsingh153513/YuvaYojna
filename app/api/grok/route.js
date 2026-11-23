// app/api/grok/route.js (for App Router)
// OR pages/api/grok.js (for Pages Router)

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

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

    // Use a model available to this Groq project, with an optional deployment override.
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
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
