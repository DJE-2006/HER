import { NextRequest, NextResponse } from "next/server";

// This file runs only on the server
import sgMail from "@sendgrid/mail";


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
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const SENDGRID_RECIPIENT = process.env.SENDGRID_RECIPIENT_EMAIL || 'dhruvjae.guboc@hcdc.edu.ph';

  if (!SENDGRID_API_KEY) {
    console.log('SendGrid: API key not configured. Skipping email.');
    return;
  }
  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const text = `Valentine Response: ${answer}\nResponse: ${response}\nTime: ${timestamp}\nDate: ${date}`;

    const msg = {
      to: process.env.SENDGRID_RECIPIENT_EMAIL || SENDGRID_RECIPIENT,
      from: process.env.SENDGRID_FROM || 'no-reply@valentine.app',
      subject: 'Valentine Response',
      text
    };

    const result = await sgMail.send(msg as any);
    console.log('SendGrid: Email send result', Array.isArray(result) ? result[0].statusCode : result);
  } catch (err) {
    console.error('SendGrid error:', err);
  }
}
