import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'OPENAI_API_KEY missing' });
      return;
    }
    const messages = Array.isArray((req.body as any)?.messages) ? (req.body as any).messages : [];
    const rsp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages.length
          ? messages
          : [
              { role: 'system', content: 'Assistant Gabarits.fr — conseils de sellerie moto.' },
              { role: 'user', content: 'Bonjour' }
            ],
        temperature: 0.4
      })
    });
    const data: any = await rsp.json();
    const reply = data?.choices?.[0]?.message?.content || 'Désolé, je n’ai pas pu répondre.';
    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'proxy_failed' });
  }
}
