import { NextRequest, NextResponse } from 'next/server';

// Webhook to track actual WhatsApp message sends
// This requires WhatsApp Business API setup

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook (WhatsApp sends a verification challenge)
    if (body.hub?.mode === 'subscribe' && body.hub?.verify_token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
      return new NextResponse(body.hub.challenge, { status: 200 });
    }

    // Process incoming webhook data
    if (body.entry && body.entry.length > 0) {
      const entry = body.entry[0];
      
      if (entry.changes && entry.changes.length > 0) {
        const change = entry.changes[0];
        
        if (change.value && change.value.messages) {
          // A message was sent to your WhatsApp Business number
          const messages = change.value.messages;
          
          for (const message of messages) {
            const phoneNumber = message.from;
            const messageText = message.text?.body || '';
            const timestamp = new Date(parseInt(message.timestamp) * 1000);
            
            // Extract tracking info from message if it contains our click_id
            const clickIdMatch = messageText.match(/click_id[=:]([^&\s]+)/);
            const clickId = clickIdMatch ? clickIdMatch[1] : null;
            
            // Log the message receipt
            console.log('WhatsApp message received:', {
              from: phoneNumber,
              text: messageText,
              timestamp,
              clickId
            });
            
            // Send conversion tracking to Google Ads
            if (clickId) {
              // You can send this to your analytics service
              await trackMessageSent(clickId, phoneNumber, messageText);
            }
            
            // Track with Google Analytics (server-side)
            // You would need to implement server-side GA4 tracking here
            
            // Track with Facebook Conversions API
            // You would implement Facebook Conversions API here
          }
        }
      }
    }
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Handle webhook verification
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

async function trackMessageSent(clickId: string, phoneNumber: string, messageText: string) {
  try {
    // Store in database or send to analytics service
    console.log('Message sent conversion tracked:', {
      clickId,
      phoneNumber,
      messageText,
      timestamp: new Date()
    });
    
    // Here you could:
    // 1. Store in your database
    // 2. Send to Google Analytics 4 Measurement Protocol
    // 3. Send to Facebook Conversions API
    // 4. Trigger Google Ads conversion tracking
    
    // Uncomment these when you're ready to use them:
    // await sendToGA4(clickId, 'whatsapp_message_sent');
    // await sendToFacebookConversions(clickId, phoneNumber);
    
  } catch (error) {
    console.error('Error tracking message sent:', error);
  }
}

// Example GA4 server-side tracking function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendToGA4(clickId: string, eventName: string) {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  
  if (!measurementId || !apiSecret) {
    console.log('GA4 credentials not configured');
    return;
  }
  
  const payload = {
    client_id: clickId,
    events: [{
      name: eventName,
      parameters: {
        engagement_time_msec: 1000,
        session_id: clickId,
        click_id: clickId
      }
    }]
  };
  
  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );
    
    console.log('GA4 tracking sent:', response.status);
  } catch (error) {
    console.error('GA4 tracking error:', error);
  }
}

// Example Facebook Conversions API function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function sendToFacebookConversions(clickId: string, phoneNumber: string) {
  const pixelId = process.env.FACEBOOK_PIXEL_ID;
  const accessToken = process.env.FACEBOOK_CONVERSIONS_API_TOKEN;
  
  if (!pixelId || !accessToken) {
    console.log('Facebook Conversions API credentials not configured');
    return;
  }
  
  // Hash phone number for privacy
  const crypto = await import('crypto');
  const hashedPhone = crypto.createHash('sha256').update(phoneNumber).digest('hex');
  
  const payload = {
    data: [{
      event_name: 'Contact',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: 'https://your-domain.com',
      user_data: {
        ph: hashedPhone
      },
      custom_data: {
        click_id: clickId,
        content_name: 'WhatsApp Message Sent',
        content_category: 'Contact',
        value: 1
      }
    }]
  };
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );
    
    console.log('Facebook Conversions API sent:', response.status);
  } catch (error) {
    console.error('Facebook Conversions API error:', error);
  }
}
