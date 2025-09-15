import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message');
  const clickId = searchParams.get('click_id');
  const utmSource = searchParams.get('utm_source');
  const utmCampaign = searchParams.get('utm_campaign');
  const gclid = searchParams.get('gclid');
  const fbclid = searchParams.get('fbclid');

  if (!message) {
    return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
  }

  // Build WhatsApp URL with tracking parameters
  const whatsappUrl = new URL('https://wa.me/+96555200604');
  whatsappUrl.searchParams.set('text', message);
  
  // Add tracking parameters
  if (utmSource) whatsappUrl.searchParams.set('utm_source', utmSource);
  if (utmCampaign) whatsappUrl.searchParams.set('utm_campaign', utmCampaign);
  if (gclid) whatsappUrl.searchParams.set('gclid', gclid);
  if (fbclid) whatsappUrl.searchParams.set('fbclid', fbclid);
  if (clickId) whatsappUrl.searchParams.set('click_id', clickId);

  // Create HTML page with tracking pixels and redirect
  const trackingHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>جاري التحويل إلى واتساب...</title>
  <style>
    body {
      font-family: 'Cairo', Arial, sans-serif;
      background: linear-gradient(135deg, #00a0e3 0%, #0078bf 100%);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
    }
    .container {
      background: rgba(255, 255, 255, 0.1);
      padding: 2rem;
      border-radius: 1rem;
      backdrop-filter: blur(10px);
      max-width: 400px;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid rgba(255, 255, 255, 0.3);
      border-top: 5px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .whatsapp-icon {
      font-size: 3rem;
      color: #25D366;
      margin-bottom: 1rem;
    }
    .manual-link {
      display: inline-block;
      background: #25D366;
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      margin-top: 1rem;
      transition: background 0.3s;
    }
    .manual-link:hover {
      background: #128C7E;
    }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <div class="whatsapp-icon">
      <i class="fab fa-whatsapp"></i>
    </div>
    <div class="spinner"></div>
    <h2>جاري التحويل إلى واتساب...</h2>
    <p>سيتم فتح واتساب تلقائياً خلال ثوانٍ</p>
    <p><small>إذا لم يتم التحويل تلقائياً:</small></p>
    <a href="${whatsappUrl.toString()}" class="manual-link" id="manual-link">
      <i class="fab fa-whatsapp"></i> افتح واتساب يدوياً
    </a>
  </div>

  <script>
    // Track page view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'WhatsApp Redirect',
        page_location: window.location.href,
        custom_parameter: 'whatsapp_redirect'
      });
    }

    // Track the redirect attempt
    if (typeof gtag !== 'undefined') {
      gtag('event', 'whatsapp_redirect_attempt', {
        event_category: 'WhatsApp',
        event_label: '${message?.substring(0, 50)}...',
        click_id: '${clickId}',
        utm_source: '${utmSource || ''}',
        utm_campaign: '${utmCampaign || ''}',
        value: 1
      });
    }

    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateContact', {
        content_name: 'WhatsApp Redirect',
        content_category: 'Contact',
        click_id: '${clickId}',
        value: 1
      });
    }

    // Redirect after 2 seconds
    setTimeout(() => {
      // Track the actual redirect
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_redirect_executed', {
          event_category: 'WhatsApp',
          event_label: '${message?.substring(0, 50)}...',
          click_id: '${clickId}',
          value: 1
        });
      }
      
      window.location.href = '${whatsappUrl.toString()}';
    }, 2000);

    // Track manual click
    document.getElementById('manual-link').addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_manual_click', {
          event_category: 'WhatsApp',
          event_label: 'Manual Link Click',
          click_id: '${clickId}',
          value: 1
        });
      }
    });

    // Track when user returns (potential message sent)
    let isHidden = false;
    document.addEventListener('visibilitychange', function() {
      if (document.hidden && !isHidden) {
        isHidden = true;
        // User left the page (went to WhatsApp)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'whatsapp_app_opened', {
            event_category: 'WhatsApp',
            event_label: 'App Opened',
            click_id: '${clickId}',
            value: 1
          });
        }
      } else if (!document.hidden && isHidden) {
        // User returned - likely sent message
        if (typeof gtag !== 'undefined') {
          gtag('event', 'whatsapp_potential_message_sent', {
            event_category: 'WhatsApp',
            event_label: 'User Returned',
            click_id: '${clickId}',
            value: 1
          });
        }
        
        // Send conversion event
        if (typeof gtag_report_conversion !== 'undefined') {
          gtag_report_conversion();
        }
        
        // Facebook conversion
        if (typeof fbq !== 'undefined') {
          fbq('track', 'Contact', {
            content_name: 'WhatsApp Message Likely Sent',
            content_category: 'Conversion',
            click_id: '${clickId}',
            value: 1
          });
        }
      }
    });

    // Track if user stays on page for more than 10 seconds (might indicate message sent)
    setTimeout(() => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_extended_engagement', {
          event_category: 'WhatsApp',
          event_label: 'Extended Page Time',
          click_id: '${clickId}',
          value: 1
        });
      }
    }, 10000);
  </script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR_GA_ID');
  </script>

  <!-- Facebook Pixel -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  </script>
</body>
</html>`;

  return new NextResponse(trackingHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
