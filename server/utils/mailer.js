const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || '587', 10),
  secure: process.env.MAIL_SECURE === 'true',
  auth: process.env.MAIL_USER && process.env.MAIL_PASS ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS } : undefined
});

async function sendMail(to, subject, text) {
  if (!to) return;
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.MAIL_USER, to, subject, text });
}

module.exports = { sendMail };

