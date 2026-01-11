const express = require('express')
const router = express.Router()

async function sendMessage(to, body) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) return { ok: false }
  const rsp = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body }
    })
  })
  const data = await rsp.json()
  return { ok: rsp.ok, data }
}

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge)
  } else {
    res.status(403).send('forbidden')
  }
})

router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry && req.body.entry[0]
    const changes = entry && entry.changes && entry.changes[0]
    const value = changes && changes.value
    const messages = value && value.messages
    if (Array.isArray(messages) && messages[0]) {
      const msg = messages[0]
      const from = msg.from
      const text = msg.text && msg.text.body
      const reply = text
        ? `Reçu: ${text}\nGabarits moto: https://traemes-gabaritstuxw.vercel.app`
        : `Bonjour, votre message est reçu.\nGabarits moto: https://traemes-gabaritstuxw.vercel.app`
      await sendMessage(from, reply)
    }
    res.status(200).json({ ok: true })
  } catch (e) {
    res.status(200).json({ ok: true })
  }
})

router.post('/send', async (req, res) => {
  try {
    const to = (req.body && req.body.to) || ''
    const body = (req.body && req.body.body) || ''
    const out = await sendMessage(to, body)
    res.status(200).json(out)
  } catch (e) {
    res.status(500).json({ ok: false })
  }
})

module.exports = router
