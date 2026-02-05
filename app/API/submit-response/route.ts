import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { response, answer, timestamp, date } = body;

    console.log('Valentine Response Received:', { response, answer, timestamp, date });

    // Send a single email notification with SendGrid
    await sendEmailNotification(response, answer, timestamp, date);

    return NextResponse.json({ success: true, message: 'Email notification sent.' });
  } catch (error) {
    console.error('Error processing response:', error);
    return NextResponse.json({ success: false, error: 'Failed to process response' }, { status: 500 });
  }
}

async function sendEmailNotification(response: string, answer: string, timestamp: string, date: string) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY';
  const SENDGRID_RECIPIENT = process.env.SENDGRID_RECIPIENT_EMAIL || 'you@example.com';

  if (SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY') {
    console.log('SendGrid: API key not configured. Skipping email.');
    return;
  }

  try {
    const text = `Valentine Response: ${answer}\nResponse: ${response}\nTime: ${timestamp}\nDate: ${date}`;

    const body = {
      personalizations: [{ to: [{ email: SENDGRID_RECIPIENT }] }],
      from: { email: 'no-reply@valentine.app', name: 'Valentine Bot' },
      subject: 'Valentine Response',
      content: [{ type: 'text/plain', value: text }]
    };

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SENDGRID_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('SendGrid: Failed to send email', errText);
    } else {
      console.log('SendGrid: Email sent successfully');
    }
  } catch (err) {
    console.error('SendGrid error:', err);
  }
}
