import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'chat-proxy',
            configureServer(server) {
                server.middlewares.use('/api/chat', async (req, res, next) => {
                    if (req.method !== 'POST')
                        return next();
                    try {
                        const chunks = [];
                        await new Promise((resolve) => {
                            req.on('data', (c) => chunks.push(Buffer.from(c)));
                            req.on('end', () => resolve());
                        });
                        const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
                        const messages = Array.isArray(body?.messages) ? body.messages : [];
                        const apiKey = process.env.OPENAI_API_KEY;
                        if (!apiKey) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ error: 'OPENAI_API_KEY missing' }));
                            return;
                        }
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
                                        {
                                            role: 'system',
                                            content: 'Tu es un assistant pour gabarits de sellerie moto. Réponds clairement en français.'
                                        },
                                        { role: 'user', content: 'Bonjour' }
                                    ],
                                temperature: 0.4
                            })
                        });
                        const data = await rsp.json();
                        const reply = data?.choices?.[0]?.message?.content || 'Désolé, je n’ai pas pu répondre.';
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ reply }));
                    }
                    catch (_e) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'proxy_failed' }));
                    }
                });
            }
        }
    ],
    base: '/'
});
