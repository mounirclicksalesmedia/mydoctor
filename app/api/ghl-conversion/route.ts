import { NextRequest, NextResponse } from 'next/server';

// Webhook to receive GoHighLevel WhatsApp message events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify it's a WhatsApp message event
    if (body.event === 'message_sent' && body.channel === 'whatsapp') {
      
      // Extract contact info
      const contactId = body.contact_id;
      const phone = body.phone;
      const message = body.message;
      const gclid = body.custom_fields?.gclid; // If you stored GCLID in contact
      
      console.log('WhatsApp message sent via GoHighLevel:', {
        contactId,
        phone,
        message: message.substring(0, 50) + '...',
        gclid
      });
      
      // Create HTML response that fires Google Ads conversion
      const conversionHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Conversion Tracked</title>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17138098917"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-17138098917');
    
    // Fire conversion immediately
    gtag('event', 'conversion', {
      'send_to': 'AW-17138098917/c5lQCPSLiJsbEOXFiuw_',
      'value': 50.0,
      'currency': 'KWD',
      'transaction_id': '${contactId}',
      'gclid': '${gclid || ''}'
    });
    
    console.log('Google Ads conversion fired for WhatsApp message');
  </script>
</head>
<body>
  <h1>Conversion Tracked Successfully</h1>
  <p>WhatsApp message conversion has been sent to Google Ads.</p>
</body>
</html>`;

      return new NextResponse(conversionHtml, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return NextResponse.json({ status: 'success', message: 'Event processed' });
    
  } catch (error) {
    console.error('GoHighLevel webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Handle webhook verification if needed
export async function GET() {
  return NextResponse.json({ 
    status: 'GoHighLevel WhatsApp Conversion Webhook Active',
    timestamp: new Date().toISOString()
  });
}

