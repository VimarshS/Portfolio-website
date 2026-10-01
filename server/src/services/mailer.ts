import { Resend } from 'resend';

interface ContactMail {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

// Stops user text from being treated as HTML inside the email
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendContactNotification(data: ContactMail): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.MAIL_FROM || 'Portfolio <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.warn('Email skipped: RESEND_API_KEY or NOTIFY_EMAIL is missing');
    return;
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `[Portfolio] ${data.category}: ${data.subject}`,
    html: `
      <h3>New portfolio message</h3>
      <p><b>Name:</b> ${escapeHtml(data.name)}</p>
      <p><b>Email:</b> ${escapeHtml(data.email)}</p>
      <p><b>Category:</b> ${escapeHtml(data.category)}</p>
      <p><b>Subject:</b> ${escapeHtml(data.subject)}</p>
      <p><b>Message:</b></p>
      <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}