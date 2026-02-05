import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { response, answer, timestamp, date } = body;

    console.log('Valentine Response Received:', {
      response,
      answer,
      timestamp,
      date
    });

    // Send to Formspree
    await sendToFormspree(response, answer, timestamp, date);

    // Send to Google Forms
    await sendToGoogleForms(response, answer, timestamp, date);

    return NextResponse.json({ 
      success: true, 
      message: 'Response recorded successfully!' 
    });
  } catch (error) {
    console.error('Error processing response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process response' },
      { status: 500 }
    );
  }
}

async function sendToFormspree(
  response: string,
  answer: string,
  timestamp: string,
  date: string
) {
  // SETUP: Replace with your Formspree endpoint
  const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || 'YOUR_FORMSPREE_ENDPOINT';

  if (FORMSPREE_ENDPOINT === 'YOUR_FORMSPREE_ENDPOINT') {
    console.log('Formspree: Please set up your endpoint first!');
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('response', response);
    formData.append('answer', answer);
    formData.append('timestamp', timestamp);
    formData.append('date', date);

    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    if (res.ok) {
      console.log('Formspree: Response sent successfully!');
    } else {
      console.error('Formspree: Failed to send response');
    }
  } catch (error) {
    console.error('Formspree error:', error);
  }
}

async function sendToGoogleForms(
  response: string,
  answer: string,
  timestamp: string,
  date: string
) {
  // SETUP: Replace with your Google Forms details
  const GOOGLE_FORM_ID = process.env.GOOGLE_FORM_ID || 'YOUR_GOOGLE_FORM_ID';
  const ENTRY_RESPONSE = process.env.ENTRY_RESPONSE || 'entry.123456789';
  const ENTRY_ANSWER = process.env.ENTRY_ANSWER || 'entry.987654321';
  const ENTRY_TIMESTAMP = process.env.ENTRY_TIMESTAMP || 'entry.111111111';
  const ENTRY_DATE = process.env.ENTRY_DATE || 'entry.222222222';

  if (GOOGLE_FORM_ID === 'YOUR_GOOGLE_FORM_ID') {
    console.log('Google Forms: Please set up your form first!');
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append(ENTRY_RESPONSE, response);
    formData.append(ENTRY_ANSWER, answer);
    formData.append(ENTRY_TIMESTAMP, timestamp);
    formData.append(ENTRY_DATE, date);

    const googleFormUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;

    await fetch(googleFormUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      mode: 'no-cors'
    });

    console.log('Google Forms: Response sent successfully!');
  } catch (error) {
    console.error('Google Forms error:', error);
  }
}