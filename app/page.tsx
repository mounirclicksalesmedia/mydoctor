'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Extend Window interface for tracking scripts
declare global {
  interface Window {
  gtag?: (command: string, action: string, parameters?: Record<string, unknown>) => void;
  fbq?: (command: string, action: string, parameters?: Record<string, unknown>) => void;
  gtag_report_conversion?: (url?: string) => boolean;
}
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams = useSearchParams();

  // WhatsApp utility functions with UTM parameter tracking
  const buildWhatsAppUrl = useCallback((message: string) => {
    const base = 'https://wa.me/+96555200604';
    const text = encodeURIComponent(message);

    // grab all the parameters we care about
    const utmSource = searchParams.get('utm_source');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmMedium = searchParams.get('utm_medium');
    const utmTerm = searchParams.get('utm_term');
    const utmContent = searchParams.get('utm_content');
    const gclid = searchParams.get('gclid');
    const fbclid = searchParams.get('fbclid');

    // build an array of param strings
    const params = [
      `text=${text}`,
      utmSource && `utm_source=${utmSource}`,
      utmCampaign && `utm_campaign=${utmCampaign}`,
      utmMedium && `utm_medium=${utmMedium}`,
      utmTerm && `utm_term=${utmTerm}`,
      utmContent && `utm_content=${utmContent}`,
      gclid && `gclid=${gclid}`,
      fbclid && `fbclid=${fbclid}`,
    ].filter(Boolean);  // remove any nulls

    return `${base}?${params.join('&')}`;
  }, [searchParams]);

  const handleWhatsAppClick = (message: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    
    // Get the WhatsApp URL
    const whatsappUrl = buildWhatsAppUrl(message);
    
    // Track Google Ads conversion and navigate
    if (typeof window !== 'undefined' && window.gtag_report_conversion) {
      window.gtag_report_conversion(whatsappUrl);
    } else {
      // Fallback: navigate directly if conversion tracking fails
      window.location.href = whatsappUrl;
    }
    
    // Track WhatsApp click events for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: message,
        value: 1
      });
    }
    
    // Track for Facebook Pixel if available
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'WhatsApp Click',
        content_category: 'Contact Form'
      });
    }
    
    console.log('WhatsApp click tracked with conversion:', message);
  };

  // Add scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    // Use a timeout to ensure elements are loaded
    const setupObserver = () => {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach((el) => observer.observe(el));
    };

    // Setup observer after component mount
    setTimeout(setupObserver, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: #0078bf;
          --secondary-color: #00a0e3;
          --accent-color: #18dafb;
          --dark-blue: #005b8f;
          --light-blue: #e6f7ff;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          overflow-x: hidden;
          color: #333;
          margin: 0;
          padding: 0;
        }
        
        .hero-gradient {
          background: linear-gradient(135deg, #00a0e3 0%, #0078bf 100%);
        }
        
        .hero-wave {
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          transform: rotate(180deg);
        }
        
        .hero-wave svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 70px;
        }
        
        .hero-wave .shape-fill {
          fill: #FFFFFF;
        }
        
        .section-wave {
          position: relative;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        
        .section-wave svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 50px;
        }
        
        .section-wave .shape-fill {
          fill: #e6f7ff;
        }
        
        .service-card {
          transition: all 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 120, 191, 0.2);
        }
        
        .testimonial-card {
          transition: all 0.3s ease;
        }
        
        .testimonial-card:hover {
          transform: scale(1.05);
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .feature-icon {
          background: linear-gradient(135deg, #00a0e3 0%, #0078bf 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .counter-box {
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
          z-index: 1;
        }
        
        .counter-box::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 160, 227, 0.1);
          z-index: -1;
        }
        
        .counter-box:hover {
          transform: translateY(-5px);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #00a0e3 0%, #0078bf 100%);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 120, 191, 0.4);
        }
        
        .btn-primary::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0078bf 0%, #00a0e3 100%);
          transition: opacity 0.3s ease;
          z-index: -1;
          opacity: 0;
        }
        
        .btn-primary:hover::after {
          opacity: 1;
        }
        
        .btn-outline {
          transition: all 0.3s ease;
          border: 2px solid #0078bf;
        }
        
        .btn-outline:hover {
          background-color: #0078bf;
          color: white;
          transform: translateY(-2px);
        }
        
        .progress-bar {
          transition: width 1s ease-in-out;
        }
        
        .office-gallery img {
          transition: transform 0.5s ease;
        }
        
        .office-gallery img:hover {
          transform: scale(1.05);
        }

        .circle-pattern {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 160, 227, 0.1) 0%, rgba(0, 120, 191, 0.1) 100%);
          z-index: 0;
        }
        
        .service-icon {
          filter: drop-shadow(0px 4px 6px rgba(0, 120, 191, 0.2));
          transition: transform 0.3s ease;
        }
        
        .service-card:hover .service-icon {
          transform: scale(1.2) rotate(5deg);
        }
        
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: bubble-float 8s infinite ease-in-out;
        }
        
        @keyframes bubble-float {
          0% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-15px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
        
        .step-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 4px;
          background-color: #0078bf;
          transform: translateX(-50%);
          z-index: -1;
        }
        
        .accordion-item {
          transition: all 0.3s ease;
        }
        
        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .accordion-item.active .accordion-content {
          max-height: 500px;
        }
        
        .accordion-item.active {
          box-shadow: 0 5px 15px rgba(0, 120, 191, 0.1);
        }
        
        .tooth-parallax {
          position: absolute;
          opacity: 0.07;
          z-index: 0;
        }

        .gallery-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .gallery-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 120, 191, 0.2);
        }

        .gallery-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
          z-index: 1;
        }

        .gallery-card:hover::before {
          left: 100%;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stagger-animation {
          animation-delay: calc(var(--stagger) * 0.1s);
        }

        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 5px rgba(0, 120, 191, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 120, 191, 0.6);
          }
          100% {
            box-shadow: 0 0 5px rgba(0, 120, 191, 0.3);
          }
        }

        /* Floating WhatsApp Button */
        .floating-whatsapp {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
          animation: whatsappPulse 2s infinite;
        }

        .floating-whatsapp:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
        }

        @keyframes whatsappPulse {
          0% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          }
          50% {
            box-shadow: 0 4px 25px rgba(37, 211, 102, 0.8);
          }
          100% {
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
          }
        }

        /* Responsive floating button */
        @media (max-width: 768px) {
          .floating-whatsapp {
            width: 50px;
            height: 50px;
            bottom: 15px;
            right: 15px;
          }
        }
        
        .direction-ltr {
          direction: ltr;
          text-align: left;
        }
      `}</style>

  <header className="relative bg-white shadow-md z-10">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-2xl font-bold text-blue-600">
          <span className="text-blue-800">ماي</span> دكتور كلينك
        </div>
      </div>
      <nav className="hidden md:flex space-x-1 space-x-reverse">
        <a
          href="#"
              className="px-3 py-2 text-blue-800 font-medium hover:text-blue-600 transition duration-300"
        >
          الرئيسية
        </a>
        <a
          href="#services"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300"
        >
          خدماتنا
        </a>
        <a
          href="#about"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300"
        >
          من نحن
        </a>
        <a
              href="#gallery"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300"
        >
              معرض الصور
        </a>
        <a
          href="#testimonials"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300"
        >
          آراء المرضى
        </a>
        <a
          href="#contact"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition duration-300"
        >
          اتصل بنا
        </a>
      </nav>
      <div className="flex items-center space-x-4 space-x-reverse">
        <a
              href={buildWhatsAppUrl("مرحباً، أريد حجز موعد في عيادة ماي دكتور لطب الأسنان")}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition duration-300 font-medium pulse-glow flex items-center"
              onClick={handleWhatsAppClick("مرحباً، أريد حجز موعد في عيادة ماي دكتور لطب الأسنان")}
            >
              <i className="fab fa-whatsapp text-lg ml-1" />
          احجز الآن
        </a>
            <button 
              className="md:hidden text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
          <i className="fas fa-bars text-xl" />
        </button>
      </div>
    </div>
  </header>

      {/* Hero Section */}
  <section className="relative overflow-hidden">
    <div className="hero-gradient text-white min-h-screen flex items-center">
      <div
        className="bubble"
        style={{ width: 100, height: 100, top: "10%", right: "10%" }}
      />
      <div
        className="bubble"
        style={{ width: 60, height: 60, bottom: "30%", right: "20%" }}
      />
      <div
        className="bubble"
        style={{ width: 120, height: 120, top: "40%", left: "10%" }}
      />
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 md:pr-10 mb-10 md:mb-0 animate-on-scroll">
            <div className="relative mb-4">
              <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold mb-2">
                أفضل عيادة أسنان في الكويت
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              ابتسامة تعكس <span className="text-yellow-300">جمالك</span> وتزيد{" "}
              <span className="text-yellow-300">ثقتك</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              نقدم لك خدمات طب أسنان متكاملة بأحدث التقنيات وعلى يد أمهر الأطباء
              لنمنحك ابتسامة مثالية تدوم مدى الحياة
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2 stagger-animation" style={{'--stagger': 1} as React.CSSProperties}>
                <i className="fas fa-check-circle text-yellow-300 mr-2" />
                <span>تقنيات حديثة</span>
              </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2 stagger-animation" style={{'--stagger': 2} as React.CSSProperties}>
                <i className="fas fa-check-circle text-yellow-300 mr-2" />
                <span>أطباء متخصصون</span>
              </div>
                  <div className="flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2 stagger-animation" style={{'--stagger': 3} as React.CSSProperties}>
                <i className="fas fa-check-circle text-yellow-300 mr-2" />
                <span>أسعار تنافسية</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                    href={buildWhatsAppUrl("مرحباً، أريد حجز موعد في عيادة ماي دكتور لطب الأسنان")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-white font-bold py-3 px-8 rounded-full text-center flex items-center justify-center"
                    onClick={handleWhatsAppClick("مرحباً، أريد حجز موعد في عيادة ماي دكتور لطب الأسنان")}
                  >
                    <i className="fab fa-whatsapp text-xl ml-2" />
                    احجز موعدك عبر واتساب
              </a>
              <a
                href="#services"
                className="btn-outline text-white font-bold py-3 px-8 rounded-full text-center flex items-center justify-center"
              >
                خدماتنا <i className="fas fa-arrow-left mr-2" />
              </a>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2 space-x-reverse mr-3">
                <Image
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://mdckuwait.com/wp-content/uploads/2019/03/mission-1-400x250.jpg"
                  alt="مريض"
                  width={40}
                  height={40}
                />
                <Image
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://mdckuwait.com/wp-content/uploads/2019/03/values-1-400x250.jpg"
                  alt="مريض"
                  width={40}
                  height={40}
                />
                <Image
                  className="w-10 h-10 rounded-full border-2 border-white"
                  src="https://mdckuwait.com/wp-content/uploads/2019/03/history-1-400x250.jpg"
                  alt="مريض"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="flex items-center text-yellow-300 mb-1">
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <span className="text-white mr-2">4.9</span>
                </div>
                <p className="text-sm opacity-90">
                  أكثر من 1,500 مريض سعيد بابتسامتهم الجديدة
                </p>
              </div>
            </div>
          </div>
              <div className="w-full md:w-1/2 relative animate-on-scroll">
            <div className="relative z-10">
              <div className="bg-white p-3 rounded-2xl shadow-lg transform rotate-3 floating">
                <Image
                  src="/hero.jpg"
                  alt="عيادة أسنان متطورة"
                  className="rounded-xl w-full h-auto"
                  width={400}
                  height={250}
                />
              </div>
              <div
                className="absolute -bottom-5 -right-5 bg-blue-700 text-white p-4 rounded-lg shadow-lg transform -rotate-3 floating"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold">15+</span>
                  <span className="text-sm">سنوات خبرة</span>
                </div>
              </div>
              <div
                className="absolute top-10 -left-10 bg-white p-3 rounded-full shadow-lg transform scale-75 floating"
                style={{ animationDelay: "0.8s" }}
              >
                <Image
                  src="https://mdckuwait.com/wp-content/uploads/2019/03/values-1-400x250.jpg"
                  alt="عيادة أسنان"
                  className="rounded-full w-32 h-32 object-cover"
                  width={128}
                  height={128}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-wave">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          />
        </svg>
      </div>
    </div>
  </section>

  {/* Services Section */}
  <section id="services" className="py-16 bg-white relative">
    <div className="tooth-parallax" style={{ top: "10%", right: "5%" }}>
      <i className="fas fa-tooth text-9xl" />
    </div>
    <div className="tooth-parallax" style={{ bottom: "15%", left: "5%" }}>
      <i className="fas fa-teeth text-9xl" />
    </div>
    <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          خدماتنا المتميزة
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          نقدم مجموعة شاملة من خدمات طب الأسنان المتخصصة بأحدث التقنيات وأعلى
          معايير الجودة
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-teeth",
                title: "تقويم الأسنان",
                description: "نقدم أحدث تقنيات تقويم الأسنان مثل التقويم الشفاف والتقويم اللغوي لتصحيح تموضع الأسنان بطريقة فعالة وجمالية.",
                whatsappText: "مرحباً، أريد معرفة المزيد عن خدمة تقويم الأسنان"
              },
              {
                icon: "fas fa-tooth",
                title: "زراعة الأسنان", 
                description: "حل دائم وطبيعي لاستبدال الأسنان المفقودة باستخدام أحدث تقنيات زراعة الأسنان الآمنة والفعالة.",
                whatsappText: "مرحباً، أريد معرفة المزيد عن خدمة زراعة الأسنان"
              },
              {
                icon: "fas fa-smile",
                title: "تجميل الأسنان",
                description: "عزز جمال ابتسامتك من خلال تقنيات تجميل الأسنان المتطورة، بما في ذلك قشور الفينير والتيجان الخزفية.",
                whatsappText: "مرحباً، أريد معرفة المزيد عن خدمة تجميل الأسنان"
              },
              {
                icon: "fas fa-sparkles",
                title: "تبييض الأسنان",
                description: "استعد لمعان ابتسامتك بأحدث تقنيات التبييض الآمنة والمتطورة مع نتائج فورية ومذهلة.",
                whatsappText: "مرحباً، أريد معرفة المزيد عن خدمة تبييض الأسنان"
              },
              {
                icon: "fas fa-hand-holding-medical",
                title: "علاج جذور الأسنان",
                description: "علاج مشاكل لب الأسنان بتقنيات متطورة وإجراءات غير مؤلمة لإنقاذ السن والحفاظ على وظيفته.",
                whatsappText: "مرحباً، أريد معرفة المزيد عن علاج جذور الأسنان"
              },
              {
                icon: "fas fa-baby",
                title: "طب أسنان الأطفال",
                description: "رعاية خاصة لأسنان الأطفال في بيئة مريحة وودية مع تقنيات مخصصة لضمان تجربة إيجابية.",
                whatsappText: "مرحباً، أريد معرفة المزيد عن خدمة طب أسنان الأطفال"
              }
            ].map((service, index) => (
              <div key={index} className="service-card bg-white rounded-xl shadow-md overflow-hidden p-6 animate-on-scroll stagger-animation" style={{'--stagger': index + 1} as React.CSSProperties}>
          <div className="mb-4">
                  <i className={`${service.icon} service-icon text-4xl text-blue-600`} />
          </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
          <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <a 
                  href={buildWhatsAppUrl(service.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium flex items-center transition duration-300 hover:text-blue-800"
                  onClick={handleWhatsAppClick(service.whatsappText)}
                >
                  <i className="fab fa-whatsapp text-lg ml-1" />
                  اسأل عبر واتساب
          </a>
        </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll">
            <a
              href={buildWhatsAppUrl("مرحباً، أريد معرفة المزيد عن خدماتكم في عيادة ماي دكتور")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-white font-bold py-3 px-8 rounded-full flex items-center justify-center max-w-xs mx-auto"
              onClick={handleWhatsAppClick("مرحباً، أريد معرفة المزيد عن خدماتكم في عيادة ماي دكتور")}
            >
              <i className="fab fa-whatsapp text-xl ml-2" />
              احجز خدمة عبر واتساب
        </a>
      </div>
    </div>
    <div className="section-wave">
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          className="shape-fill"
        />
      </svg>
    </div>
  </section>

      {/* Before and After Gallery Section 
      <section id="gallery" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full mb-4">معرض الصور</div>
            <h2 className="text-3xl md:text-4xl font-bold">صور <span className="text-blue-600">قبل وبعد</span></h2>
            <p className="max-w-2xl mx-auto text-gray-600 mt-4">نتائج مذهلة لمرضانا الذين وضعوا ثقتهم في عيادة ماي دكتور لطب الأسنان</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "تبييض الأسنان المتقدم",
                description: "تحول مذهل لدرجة لون الأسنان باستخدام تقنيات التبييض المتطورة والآمنة.",
                category: "تبييض الأسنان"
              },
              {
                title: "قشور البورسلين (فينير)",
                description: "تحول جذري لشكل ولون الأسنان الأمامية باستخدام قشور البورسلين عالية الجودة.",
                category: "تركيب الفينير"
              },
              {
                title: "تقويم الأسنان الشفاف",
                description: "تصحيح تراكب وميلان الأسنان باستخدام تقنية التقويم الشفاف غير المرئي.",
                category: "تقويم الأسنان"
              },
              {
                title: "زراعة الأسنان الأمامية",
                description: "استعادة الأسنان المفقودة في المنطقة الأمامية بزراعات تبدو طبيعية تماماً.",
                category: "زراعة الأسنان"
              },
              {
                title: "تصميم الابتسامة الشامل",
                description: "تحول كامل للابتسامة باستخدام مجموعة من التقنيات التجميلية المتكاملة.",
                category: "تصميم الابتسامة"
              },
              {
                title: "جراحة تجميل اللثة",
                description: "تحسين شكل اللثة وعلاج مشكلة ابتسامة اللثة العالية لنتائج جمالية مثالية.",
                category: "تجميل اللثة"
              }
            ].map((item, index) => (
              <div key={index} className="gallery-card bg-white p-4 rounded-lg shadow-md animate-on-scroll stagger-animation" style={{'--stagger': index + 1} as React.CSSProperties}>
                <div className="h-60 bg-gradient-to-br from-blue-50 to-blue-100 mb-4 rounded flex items-center justify-center relative overflow-hidden">
                  <div className="text-center z-10">
                    <div className="bg-white rounded-full p-4 mb-4 shadow-lg">
                      <i className="fas fa-images text-blue-400 text-4xl"></i>
                    </div>
                    <p className="text-blue-600 font-medium">صور قبل وبعد - {item.category}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent"></div>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {item.category}
                  </span>
                  <a
                    href={buildWhatsAppUrl(`مرحباً، أريد استشارة مجانية حول تجميل الأسنان - ${item.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition duration-300"
                    onClick={handleWhatsAppClick(`مرحباً، أريد استشارة مجانية حول تجميل الأسنان - ${item.title}`)}
                  >
                    <i className="fas fa-question-circle text-lg"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-on-scroll">
            <a
              href={buildWhatsAppUrl("مرحباً، أريد استشارة مجانية حول تجميل الأسنان")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-white font-bold py-3 px-8 rounded-full flex items-center justify-center max-w-xs mx-auto"
              onClick={handleWhatsAppClick("مرحباً، أريد استشارة مجانية حول تجميل الأسنان")}
            >
              <i className="fab fa-whatsapp text-xl ml-2" />
              استشارة مجانية عبر واتساب
            </a>
          </div>
        </div>
      </section> */}

  {/* Why Choose Us Section */}
      <section id="why-us" className="py-16 bg-white relative">
    <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          لماذا تختار عيادة ماي دكتور؟
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          نحن نجمع بين الخبرة والتكنولوجيا والرعاية الشخصية لنمنحك أفضل تجربة
          علاج أسنان ممكنة
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "fas fa-user-md", number: "15+", text: "سنوات من الخبرة" },
              { icon: "fas fa-smile-beam", number: "5,000+", text: "ابتسامة مثالية" },
              { icon: "fas fa-award", number: "100%", text: "رضا المرضى" },
              { icon: "fas fa-cog", number: "12+", text: "تقنيات متطورة" }
            ].map((item, index) => (
              <div key={index} className="counter-box bg-white p-8 rounded-xl shadow-md text-center animate-on-scroll stagger-animation" style={{'--stagger': index + 1} as React.CSSProperties}>
          <div className="text-4xl text-blue-600 mb-4">
                  <i className={item.icon} />
          </div>
                <h3 className="text-3xl font-bold mb-2">{item.number}</h3>
                <p className="text-gray-600">{item.text}</p>
        </div>
            ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            <div className="flex flex-col justify-center animate-on-scroll">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            تقنيات متطورة لتشخيص وعلاج دقيق
          </h3>
              {[
                {
                  title: "تصوير ثلاثي الأبعاد",
                  description: "تشخيص دقيق واستثنائي باستخدام أحدث أجهزة التصوير ثلاثي الأبعاد لتخطيط العلاج بكفاءة عالية."
                },
                {
                  title: "العلاج بالليزر",
                  description: "استخدام أحدث تقنيات الليزر للعلاجات المختلفة بدقة عالية وألم أقل وفترة تعافي أسرع."
                },
                {
                  title: "تصميم الابتسامة الرقمي",
                  description: "تصور شكل ابتسامتك الجديدة قبل بدء العلاج باستخدام برامج متطورة لتصميم الابتسامة المثالية."
                }
              ].map((item, index) => (
                <div key={index} className="mb-6">
            <h4 className="text-xl font-semibold mb-2 flex items-center">
              <i className="fas fa-check-circle text-blue-600 ml-2" />
                    {item.title}
            </h4>
            <p className="text-gray-600 pr-9">
                    {item.description}
            </p>
          </div>
              ))}
          </div>
            <div className="relative animate-on-scroll">
          <Image
            src="/doc.jpg"
            alt="تقنيات متطورة لطب الأسنان"
            className="rounded-xl shadow-lg w-full h-auto"
            width={400}
            height={250}
          />
          <div className="absolute inset-0 bg-blue-900 bg-opacity-20 rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <a
                  href={buildWhatsAppUrl("مرحباً، أريد معرفة المزيد عن التقنيات المتطورة لديكم")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-full p-4 shadow-lg hover:transform hover:scale-110 transition duration-300 flex items-center justify-center"
                  onClick={handleWhatsAppClick("مرحباً، أريد معرفة المزيد عن التقنيات المتطورة لديكم")}
                >
                  <i className="fab fa-whatsapp text-blue-600 text-xl" />
            </a>
          </div>
        </div>
      </div>
          <div className="text-center mt-12 animate-on-scroll">
            <a
              href={buildWhatsAppUrl("مرحباً، لماذا يجب أن أختار عيادة ماي دكتور؟")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-white font-bold py-3 px-8 rounded-full flex items-center justify-center max-w-xs mx-auto"
              onClick={handleWhatsAppClick("مرحباً، لماذا يجب أن أختار عيادة ماي دكتور؟")}
            >
              <i className="fab fa-whatsapp text-xl ml-2" />
              اسأل عبر واتساب
            </a>
          </div>
    </div>
  </section>

  {/* Testimonials Section - HIDDEN */}
  {/*
      <section id="testimonials" className="py-16 bg-blue-50 relative">
    <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          كلمات مرضانا
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          استمع لتجارب مرضانا الحقيقية وقصص نجاحهم مع عيادة ماي دكتور
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد السالم",
                service: "تقويم الأسنان",
                testimonial: "كانت تجربتي مع عيادة ماي دكتور لطب الأسنان رائعة حقاً. الفريق محترف والأطباء ذوو خبرة عالية. نتيجة تقويم أسناني تفوق توقعاتي!"
              },
              {
                name: "نورة العبدالله",
                service: "زراعة الأسنان",
                testimonial: "أجريت عملية زراعة أسنان، والنتيجة مذهلة! الأسنان المزروعة تبدو طبيعية تماماً والإجراء كان أقل إيلاماً مما توقعت. أشعر بالثقة عند الابتسام الآن."
              },
              {
                name: "فيصل المطيري",
                service: "تبييض الأسنان",
                testimonial: "تجربة تبييض الأسنان كانت رائعة! النتائج فورية والفرق واضح. الطاقم محترف جداً والعيادة مجهزة بأحدث التقنيات. أنصح بهم بشدة!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card bg-white rounded-xl shadow-md p-6 relative animate-on-scroll stagger-animation" style={{'--stagger': index + 1} as React.CSSProperties}>
          <div className="text-blue-600 text-5xl absolute -top-4 right-4 opacity-20">
            <i className="fas fa-quote-right" />
          </div>
          <div className="text-yellow-400 mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star" />
                  ))}
          </div>
          <p className="text-gray-600 mb-6">
                  {testimonial.testimonial}
          </p>
          <div className="flex items-center">
            <div className="ml-4">
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.service}</p>
            </div>
          </div>
        </div>
            ))}
          </div>
          <div className="text-center mt-12 animate-on-scroll">
            <a
              href={buildWhatsAppUrl("مرحباً، أريد مشاركة تجربتي أو الحصول على استشارة")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block text-white font-bold py-3 px-8 rounded-full flex items-center justify-center max-w-xs mx-auto"
              onClick={handleWhatsAppClick("مرحباً، أريد مشاركة تجربتي أو الحصول على استشارة")}
            >
              <i className="fab fa-whatsapp text-xl ml-2" />
              شارك تجربتك عبر واتساب
            </a>
      </div>
    </div>
  </section>
  */}

  {/* WhatsApp Appointment Section */}
  <section id="appointment" className="py-20 bg-gradient-to-br from-green-50 to-blue-50 relative overflow-hidden">
    {/* Background decorative elements */}
    <div className="absolute top-10 right-10 w-32 h-32 bg-green-100 rounded-full opacity-20 animate-pulse"></div>
    <div className="absolute bottom-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12 animate-on-scroll">
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
            <i className="fab fa-whatsapp text-xl ml-2"></i>
            <span className="font-medium">حجز فوري عبر واتساب</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            احجز موعدك <span className="text-green-600">بنقرة واحدة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            تواصل معنا مباشرة عبر واتساب واحجز موعدك في أقل من دقيقة. فريقنا جاهز للرد عليك فوراً!
          </p>
        </div>

        {/* Main WhatsApp Booking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "fas fa-calendar-check",
              title: "حجز موعد عادي",
              description: "احجز موعدك لفحص دوري أو استشارة عامة",
              message: "مرحباً، أريد حجز موعد عادي في عيادة ماي دكتور لطب الأسنان",
              color: "blue",
              popular: false
            },
            {
              icon: "fas fa-bolt",
              title: "موعد طارئ",
              description: "للحالات العاجلة والطارئة - رد سريع",
              message: "مرحباً، لدي حالة طارئة وأحتاج موعد عاجل في عيادة ماي دكتور",
              color: "red",
              popular: true
            },
            {
              icon: "fas fa-user-md",
              title: "استشارة مجانية",
              description: "احصل على استشارة أولية مجانية مع أطبائنا",
              message: "مرحباً، أريد الحصول على استشارة مجانية من عيادة ماي دكتور",
              color: "green",
              popular: false
            }
          ].map((booking, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-on-scroll stagger-animation ${booking.popular ? 'ring-2 ring-green-400' : ''}`} style={{'--stagger': index + 1} as React.CSSProperties}>
              {booking.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">الأكثر طلباً</span>
                </div>
              )}
              
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                booking.color === 'blue' ? 'bg-blue-100' :
                booking.color === 'red' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <i className={`${booking.icon} text-2xl ${
                  booking.color === 'blue' ? 'text-blue-600' :
                  booking.color === 'red' ? 'text-red-600' : 'text-green-600'
                }`}></i>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800">{booking.title}</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">{booking.description}</p>
              
              <a
                href={buildWhatsAppUrl(booking.message)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center transform hover:scale-105 ${
                  booking.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  booking.color === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
                onClick={handleWhatsAppClick(booking.message)}
              >
                <i className="fab fa-whatsapp text-xl ml-2"></i>
                احجز الآن
              </a>
            </div>
          ))}
        </div>

        {/* Quick Contact Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-on-scroll">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-phone-alt text-blue-600 text-xl"></i>
              </div>
                             <h4 className="font-bold text-gray-800 mb-2">اتصل مباشرة</h4>
               <p className="text-gray-600">+965 5520 0604</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-clock text-green-600 text-xl"></i>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">ساعات العمل</h4>
              <p className="text-gray-600">9:00 ص - 9:00 م</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-map-marker-alt text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">الموقع</h4>
              <p className="text-gray-600">السالمية، الكويت</p>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="mt-12 animate-on-scroll">
          <a
            href={buildWhatsAppUrl("مرحباً، أريد حجز موعد في عيادة ماي دكتور لطب الأسنان")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl pulse-glow"
            onClick={handleWhatsAppClick("مرحباً، أريد حجز موعد في عيادة ماي دكتور لطب الأسنان")}
          >
            <i className="fab fa-whatsapp text-2xl ml-3"></i>
            <span>تواصل معنا عبر واتساب الآن</span>
            <i className="fas fa-arrow-left mr-3"></i>
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            <i className="fas fa-shield-alt ml-1"></i>
            رد سريع خلال دقائق • خصوصية تامة • خدمة 24/7
          </p>
        </div>
      </div>
    </div>
  </section>

  {/* FAQ Section - HIDDEN */}
  {/*
      <section className="py-16 bg-blue-50 relative">
    <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          الأسئلة الشائعة
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا وإجراءاتنا
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4" />
      </div>
      <div className="max-w-3xl mx-auto">
            {[
              {
                question: "كم تستغرق عملية تقويم الأسنان؟",
                answer: "تختلف مدة علاج تقويم الأسنان حسب حالة كل مريض، لكنها تتراوح عادةً بين 18-24 شهراً. بعد تقييم شامل لحالتك، سيقدم لك الطبيب خطة علاج تفصيلية مع تحديد المدة المتوقعة للعلاج."
              },
              {
                question: "هل زراعة الأسنان مؤلمة؟",
                answer: "تتم زراعة الأسنان تحت تأثير التخدير الموضعي، لذا لن تشعر بألم أثناء الإجراء. قد يكون هناك بعض الانزعاج البسيط بعد زوال التخدير، لكن يمكن السيطرة عليه بمسكنات الألم العادية. معظم المرضى يصفون التجربة بأنها أقل إزعاجاً مما توقعوا."
              },
              {
                question: "كم مرة يجب أن أزور طبيب الأسنان؟",
                answer: "ينصح بزيارة طبيب الأسنان للفحص والتنظيف مرتين سنوياً على الأقل، حتى لو كنت لا تعاني من أي مشاكل. الفحوصات الدورية تساعد في اكتشاف المشكلات المحتملة مبكراً قبل أن تتفاقم وتتطلب علاجات أكثر تعقيداً وتكلفة."
              },
              {
                question: "كم تدوم نتائج تبييض الأسنان؟",
                answer: "تختلف مدة نتائج تبييض الأسنان من شخص لآخر، لكنها عادةً تدوم من 6 أشهر إلى سنتين. يمكن إطالة مدة النتائج من خلال تجنب المشروبات والأطعمة الملونة، والإقلاع عن التدخين، والحفاظ على نظافة الفم بشكل جيد، مع زيارات دورية لطبيب الأسنان."
              },
              {
                question: "هل أنظمة التأمين تغطي علاجات الأسنان التجميلية؟",
                answer: "معظم شركات التأمين لا تغطي إجراءات طب الأسنان التجميلية البحتة. ومع ذلك، قد تغطي بعض الإجراءات الضرورية طبياً حتى لو كانت لها فوائد تجميلية. نعمل مع العديد من شركات التأمين ونقدم خيارات دفع مرنة وخطط تقسيط متعددة لمساعدة المرضى على الحصول على العلاج المناسب."
              }
            ].map((faq, index) => (
              <div key={index} className={`accordion-item mb-4 border border-gray-200 rounded-lg overflow-hidden ${activeAccordion === index ? 'active' : ''} animate-on-scroll stagger-animation`} style={{'--stagger': index + 1} as React.CSSProperties}>
                <div 
                  className="accordion-header p-4 flex justify-between items-center cursor-pointer bg-white hover:bg-gray-50 transition duration-300"
                  onClick={() => toggleAccordion(index)}
                >
            <h4 className="font-semibold text-lg">
                    {faq.question}
            </h4>
                  <i className={`fas ${activeAccordion === index ? 'fa-minus' : 'fa-plus'} text-blue-600 transition-transform duration-300`} />
          </div>
                <div className={`accordion-content bg-white p-4 border-t transition-all duration-300 ${activeAccordion === index ? 'max-h-96' : 'max-h-0 overflow-hidden'}`}>
            <p className="text-gray-600">
                    {faq.answer}
            </p>
          </div>
        </div>
            ))}
      </div>
    </div>
  </section>
  */}

  {/* Footer Section */}
  <footer className="bg-blue-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-on-scroll">
          <h4 className="text-2xl font-bold mb-6">عيادة ماي دكتور</h4>
          <p className="mb-4">
            مركز متخصص في طب الأسنان يقدم أحدث خدمات الرعاية السنية بأيدي أمهر
            الأطباء والمتخصصين.
          </p>
          <div className="flex space-x-4 space-x-reverse">
                {[
                  { 
                    icon: "fab fa-whatsapp", 
                    href: buildWhatsAppUrl("مرحباً، أريد التواصل معكم من خلال الموقع"), 
                    isWhatsapp: true,
                    message: "مرحباً، أريد التواصل معكم من خلال الموقع"
                  },
                  { icon: "fab fa-facebook-f", href: "#", isWhatsapp: false },
                  { icon: "fab fa-instagram", href: "#", isWhatsapp: false },
                  { icon: "fab fa-linkedin-in", href: "#", isWhatsapp: false }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target={social.isWhatsapp ? "_blank" : "_self"}
                    rel={social.isWhatsapp ? "noopener noreferrer" : ""}
                    className={`bg-white text-blue-900 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-blue-100 ${social.isWhatsapp ? "transform scale-110 shadow-lg" : ""}`}
                    onClick={social.isWhatsapp ? handleWhatsAppClick(social.message || "") : undefined}
                  >
                    <i className={social.icon} />
                  </a>
                ))}
          </div>
        </div>
            <div className="animate-on-scroll">
          <h4 className="text-xl font-bold mb-6">روابط سريعة</h4>
          <ul className="space-y-2">
                {[
                  { text: "الرئيسية", href: "#" },
                  { text: "خدماتنا", href: "#services" },
                  { text: "من نحن", href: "#about" },
                  { text: "معرض الصور", href: "#gallery" },
                  { text: "آراء المرضى", href: "#testimonials" },
                  { text: "اتصل بنا", href: "#contact" }
                ].map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="hover:text-blue-300 transition">
                      {link.text}
              </a>
            </li>
                ))}
          </ul>
        </div>
            <div className="animate-on-scroll">
          <h4 className="text-xl font-bold mb-6">خدماتنا</h4>
          <ul className="space-y-2">
                {[
                  "تقويم الأسنان",
                  "زراعة الأسنان",
                  "تجميل الأسنان",
                  "تبييض الأسنان",
                  "علاج جذور الأسنان",
                  "طب أسنان الأطفال"
                ].map((service, index) => (
                  <li key={index}>
              <a href="#" className="hover:text-blue-300 transition">
                      {service}
              </a>
            </li>
                ))}
          </ul>
        </div>
            <div className="animate-on-scroll">
          <h4 className="text-xl font-bold mb-6">تواصل معنا</h4>
          <div className="space-y-4">
                {[
                  { icon: "fas fa-map-marker-alt", text: "السالمية، بلوك 6، شارع 8، الكويت" },
                  { icon: "fas fa-phone-alt", text: "+965 5520 0604" },
                  { icon: "fas fa-envelope", text: "info@kw.my-doctor-dental.com" },
                  { icon: "fas fa-clock", text: "12:00 الظهر - 9:00 مساءً" }
                ].map((contact, index) => (
                  <p key={index} className="flex items-start">
                    <i className={`${contact.icon} ml-3 mt-1`} />
                    <span className={contact.icon === "fas fa-phone-alt" ? "direction-ltr" : ""}>{contact.text}</span>
                  </p>
                ))}
          </div>
        </div>
      </div>
      <hr className="border-blue-800 my-8" />
      <div className="text-center">
            <p>© 2025 عيادة ماي دكتور لطب الأسنان. جميع الحقوق محفوظة.</p>
      </div>
    </div>
  </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={buildWhatsAppUrl("مرحباً، أريد الاستفسار عن خدمات عيادة ماي دكتور لطب الأسنان")}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp"
        title="تواصل معنا عبر واتساب"
        onClick={handleWhatsAppClick("مرحباً، أريد الاستفسار عن خدمات عيادة ماي دكتور لطب الأسنان")}
      >
        <i className="fab fa-whatsapp text-white text-2xl" />
      </a>
    </>
  );
}
