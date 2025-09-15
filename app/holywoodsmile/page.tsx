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

export default function HollywoodSmilePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeBeforeAfter, setActiveBeforeAfter] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedShade, setSelectedShade] = useState('BL2');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const searchParams = useSearchParams();

  // Show offer modal after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOfferModal(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // WhatsApp utility functions
  const buildWhatsAppUrl = useCallback((message: string) => {
    const base = 'https://wa.me/+96555200604';
    const text = encodeURIComponent(message);

    const utmSource = searchParams.get('utm_source');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmMedium = searchParams.get('utm_medium');
    const utmTerm = searchParams.get('utm_term');
    const utmContent = searchParams.get('utm_content');
    const gclid = searchParams.get('gclid');
    const fbclid = searchParams.get('fbclid');

    const params = [
      `text=${text}`,
      utmSource && `utm_source=${utmSource}`,
      utmCampaign && `utm_campaign=${utmCampaign}`,
      utmMedium && `utm_medium=${utmMedium}`,
      utmTerm && `utm_term=${utmTerm}`,
      utmContent && `utm_content=${utmContent}`,
      gclid && `gclid=${gclid}`,
      fbclid && `fbclid=${fbclid}`,
    ].filter(Boolean);

    return `${base}?${params.join('&')}`;
  }, [searchParams]);

  const handleWhatsAppClick = (message: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    
    const whatsappUrl = buildWhatsAppUrl(message);
    
    if (typeof window !== 'undefined' && window.gtag_report_conversion) {
      window.gtag_report_conversion(whatsappUrl);
    } else {
      window.location.href = whatsappUrl;
    }
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: message,
        value: 1
      });
    }
    
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: 'WhatsApp Click - Hollywood Smile',
        content_category: 'Contact Form'
      });
    }
  };

  // Scroll animations
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

    const setupObserver = () => {
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach((el) => observer.observe(el));
    };

    setTimeout(setupObserver, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Hollywood Smile Cases
  const hollywoodCases = [
    {
      id: 1,
      name: "سارة أحمد",
      age: 28,
      treatment: "20 قشرة فينير",
      duration: "أسبوعين",
      beforeImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=400&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=600&h=400&fit=crop",
      testimonial: "حلمت بابتسامة مثالية لسنوات، والآن أصبح الحلم حقيقة! النتيجة فاقت كل توقعاتي",
      rating: 5
    },
    {
      id: 2,
      name: "نورا الخالد",
      age: 35,
      treatment: "16 قشرة فينير + تبييض",
      duration: "10 أيام",
      beforeImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=400&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1575202332411-b01fe9ace7a8?w=600&h=400&fit=crop",
      testimonial: "الفريق الطبي محترف جداً، والنتيجة طبيعية ومذهلة. أنصح الجميع بالتجربة",
      rating: 5
    },
    {
      id: 3,
      name: "مريم العتيبي",
      age: 42,
      treatment: "24 قشرة فينير كاملة",
      duration: "3 أسابيع",
      beforeImage: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=600&h=400&fit=crop",
      afterImage: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop",
      testimonial: "تغيرت حياتي بالكامل! أصبحت أبتسم بثقة في كل الصور والمناسبات",
      rating: 5
    }
  ];

  // Shade Guide
  const shadeGuide = [
    { code: 'BL1', name: 'أبيض لؤلؤي', hex: '#FDFEFF' },
    { code: 'BL2', name: 'أبيض طبيعي', hex: '#FAFBFC' },
    { code: 'BL3', name: 'أبيض دافئ', hex: '#F8F9FA' },
    { code: 'BL4', name: 'أبيض كريمي', hex: '#F5F6F7' },
    { code: 'A1', name: 'طبيعي فاتح', hex: '#F2F3F4' },
    { code: 'A2', name: 'طبيعي', hex: '#EBEDEF' }
  ];

  // Quiz Questions
  const quizQuestions = [
    {
      question: "ما هو هدفك الأساسي من ابتسامة هوليوود؟",
      options: ["تحسين الشكل الجمالي", "إصلاح مشاكل وظيفية", "الاثنان معاً", "تعزيز الثقة بالنفس"]
    },
    {
      question: "ما هي حالة أسنانك الحالية؟",
      options: ["أسنان صحية لكن غير منتظمة", "تصبغات وإصفرار", "أسنان مكسورة أو تالفة", "فراغات بين الأسنان"]
    },
    {
      question: "ما هي درجة البياض المفضلة لديك؟",
      options: ["أبيض هوليوودي لامع", "أبيض طبيعي", "أبيض مع لمسة طبيعية", "حسب توصية الطبيب"]
    },
    {
      question: "متى تريد البدء بالعلاج؟",
      options: ["فوراً", "خلال أسبوع", "خلال شهر", "أريد الاستشارة أولاً"]
    }
  ];

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers, answer];
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      // Quiz completed - show results
      const message = `مرحباً، أكملت اختبار ابتسامة هوليوود. إجاباتي: ${newAnswers.join(', ')}. أريد استشارة مخصصة`;
      window.location.href = buildWhatsAppUrl(message);
    }
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --gold: #D4AF37;
          --gold-light: #F4E5B7;
          --gold-dark: #B8941F;
          --luxury-black: #1a1a1a;
          --luxury-gray: #2d2d2d;
          --white: #ffffff;
          --cream: #FFF8E7;
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Cairo', 'Playfair Display', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          color: #333;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        
        /* Luxury Hero Gradient */
        .luxury-gradient {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
          position: relative;
        }
        
        .luxury-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        /* Gold Shimmer Effect */
        .gold-shimmer {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Interactive Before/After Slider */
        .comparison-slider {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          cursor: col-resize;
        }
        
        .comparison-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .comparison-image.after {
          clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
        }
        
        .comparison-slider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 4px;
          background: var(--gold);
          left: 50%;
          transform: translateX(-50%);
          cursor: col-resize;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        
        .comparison-slider-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--gold);
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: col-resize;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        /* Shade Selector */
        .shade-selector {
          display: flex;
          gap: 15px;
          padding: 20px;
          background: #f8f8f8;
          border-radius: 15px;
          overflow-x: auto;
        }
        
        .shade-option {
          min-width: 80px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .shade-tooth {
          width: 60px;
          height: 80px;
          margin: 0 auto 10px;
          border-radius: 30px 30px 15px 15px;
          border: 2px solid #ddd;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .shade-option.selected .shade-tooth {
          border-color: var(--gold);
          transform: scale(1.1);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }
        
        .shade-code {
          font-weight: bold;
          font-size: 14px;
        }
        
        .shade-name {
          font-size: 11px;
          color: #666;
        }
        
        /* Quiz Card */
        .quiz-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        
        .quiz-progress {
          height: 8px;
          background: #e0e0e0;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .quiz-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%);
          transition: width 0.5s ease;
        }
        
        .quiz-option {
          padding: 20px;
          border: 2px solid #e0e0e0;
          border-radius: 15px;
          margin-bottom: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }
        
        .quiz-option:hover {
          border-color: var(--gold);
          transform: translateX(-5px);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }
        
        /* Luxury Button */
        .luxury-button {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: white;
          padding: 15px 40px;
          border-radius: 50px;
          font-weight: bold;
          font-size: 18px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
          position: relative;
          overflow: hidden;
        }
        
        .luxury-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .luxury-button:hover::before {
          left: 100%;
        }
        
        .luxury-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(212, 175, 55, 0.4);
        }
        
        /* Price Tag */
        .price-tag {
          position: relative;
          background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
          color: white;
          padding: 10px 25px;
          border-radius: 30px;
          font-weight: bold;
          display: inline-block;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Testimonial Card */
        .testimonial-luxury {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          position: relative;
          border: 1px solid var(--gold-light);
        }
        
        .testimonial-luxury::before {
          content: '"';
          position: absolute;
          top: -20px;
          left: 30px;
          font-size: 80px;
          color: var(--gold);
          opacity: 0.3;
          font-family: 'Playfair Display', serif;
        }
        
        /* Floating Elements */
        .floating-badge {
          position: fixed;
          bottom: 100px;
          left: 20px;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 999;
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        /* Guarantee Badge */
        .guarantee-badge {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .guarantee-badge::after {
          content: '✓';
          position: absolute;
          top: -30px;
          right: -30px;
          font-size: 100px;
          opacity: 0.1;
        }
        
        /* Offer Modal */
        .luxury-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        
        .luxury-modal-content {
          background: white;
          border-radius: 30px;
          padding: 50px;
          max-width: 600px;
          width: 90%;
          position: relative;
          border: 3px solid var(--gold);
          animation: slideUp 0.5s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        /* WhatsApp Floating Button */
        .whatsapp-luxury {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5);
          z-index: 1000;
          animation: whatsappPulse 2s infinite;
        }
        
        .whatsapp-luxury:hover {
          transform: scale(1.1);
        }
        
        @keyframes whatsappPulse {
          0%, 100% { box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5); }
          50% { box-shadow: 0 10px 40px rgba(37, 211, 102, 0.8); }
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
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .comparison-slider {
            height: 300px;
          }
          
          .luxury-modal-content {
            padding: 30px;
          }
          
          .quiz-container {
            padding: 20px;
          }
        }
      `}</style>

      {/* Luxury Header */}
      <header className="bg-black text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="gold-shimmer">Hollywood Smile</span>
                <span className="text-white text-sm block">by My Doctor Clinic</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
              <a href="#transformations" className="hover:text-yellow-400 transition">التحولات</a>
              <a href="#process" className="hover:text-yellow-400 transition">كيف نعمل</a>
              <a href="#shades" className="hover:text-yellow-400 transition">درجات الأسنان</a>
              <a href="#packages" className="hover:text-yellow-400 transition">الباقات</a>
              <a href="#guarantee" className="hover:text-yellow-400 transition">الضمان</a>
            </nav>
            
            <a
              href={buildWhatsAppUrl("مرحباً، أريد الحصول على ابتسامة هوليوود")}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button hidden md:flex items-center"
              onClick={handleWhatsAppClick("مرحباً، أريد الحصول على ابتسامة هوليوود")}
            >
              <i className="fab fa-whatsapp text-xl ml-2" />
              استشارة مجانية
            </a>
            
            <button 
              className="md:hidden text-yellow-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="fas fa-bars text-xl" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="luxury-gradient text-white min-h-screen flex items-center relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll">
              <div className="inline-block mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold inline-flex items-center">
                  <i className="fas fa-star ml-2"></i>
                  عرض حصري - خصم 40% لفترة محدودة
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                ابتسامة
                <span className="gold-shimmer block">هوليوود</span>
                <span className="text-3xl md:text-4xl font-light">التي تحلم بها</span>
              </h1>
              
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                احصل على ابتسامة المشاهير بأحدث تقنيات الفينير الألماني
                <br />
                نتائج فورية تدوم +15 سنة مع ضمان مدى الحياة
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <i className="fas fa-tooth text-yellow-400 text-2xl mb-2"></i>
                  <div className="font-bold">E-MAX فينير</div>
                  <div className="text-sm opacity-80">أقوى وأجمل أنواع القشور</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <i className="fas fa-calendar-check text-yellow-400 text-2xl mb-2"></i>
                  <div className="font-bold">7 أيام فقط</div>
                  <div className="text-sm opacity-80">للحصول على ابتسامة كاملة</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <i className="fas fa-shield-alt text-yellow-400 text-2xl mb-2"></i>
                  <div className="font-bold">ضمان 15 سنة</div>
                  <div className="text-sm opacity-80">على جميع القشور</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <i className="fas fa-award text-yellow-400 text-2xl mb-2"></i>
                  <div className="font-bold">+5000 ابتسامة</div>
                  <div className="text-sm opacity-80">نجحنا في تحقيقها</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={buildWhatsAppUrl("مرحباً، أريد الحصول على استشارة مجانية لابتسامة هوليوود")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-button flex items-center justify-center"
                  onClick={handleWhatsAppClick("مرحباً، أريد الحصول على استشارة مجانية لابتسامة هوليوود")}
                >
                  <i className="fab fa-whatsapp text-2xl ml-2" />
                  احصل على استشارة مجانية الآن
                </a>
                <a
                  href="#quiz"
                  className="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-300 px-8 py-4 rounded-full font-bold text-center"
                >
                  اكتشف ابتسامتك المثالية
                </a>
              </div>
              
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-3 space-x-reverse">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-black flex items-center justify-center text-xs font-bold">
                      <i className="fas fa-user text-black"></i>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-yellow-400 font-bold">+5,000 عميل سعيد</div>
                  <div className="text-sm opacity-80">انضم إليهم اليوم</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-on-scroll">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=800&h=600&fit=crop"
                  alt="Hollywood Smile Result"
                  className="rounded-3xl shadow-2xl w-full"
                  width={800}
                  height={600}
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-6 rounded-2xl shadow-xl">
                  <div className="text-3xl font-bold">299 د.ك</div>
                  <div className="text-sm">للسن الواحد</div>
                  <div className="text-xs line-through opacity-70">بدلاً من 500 د.ك</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Transformations */}
      <section id="transformations" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold mb-4">
              نتائج حقيقية 100%
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              شاهد <span className="gold-shimmer">التحول المذهل</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تحولات حقيقية لعملائنا - قبل وبعد ابتسامة هوليوود
            </p>
          </div>
          
          {/* Interactive Before/After Slider */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="comparison-slider" 
                 onMouseMove={(e) => {
                   if (isDragging) {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const percentage = (x / rect.width) * 100;
                     setSliderPosition(Math.min(Math.max(percentage, 0), 100));
                   }
                 }}
                 onMouseDown={() => setIsDragging(true)}
                 onMouseUp={() => setIsDragging(false)}
                 onMouseLeave={() => setIsDragging(false)}>
              <Image 
                src={hollywoodCases[activeBeforeAfter].beforeImage}
                alt="Before"
                className="comparison-image"
                width={400}
                height={300}
              />
              <Image 
                src={hollywoodCases[activeBeforeAfter].afterImage}
                alt="After"
                className="comparison-image after"
                width={400}
                height={300}
                style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
              />
              <div className="comparison-slider-line" style={{ left: `${sliderPosition}%` }}>
                <div className="comparison-slider-button">
                  <i className="fas fa-arrows-alt-h text-white"></i>
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full font-bold">
                قبل
              </div>
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">
                بعد
              </div>
            </div>
          </div>
          
          {/* Case Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {hollywoodCases.map((case_, index) => (
              <div 
                key={case_.id}
                className={`testimonial-luxury cursor-pointer transition-all duration-300 ${activeBeforeAfter === index ? 'ring-4 ring-yellow-400 transform scale-105' : 'hover:shadow-xl'}`}
                onClick={() => setActiveBeforeAfter(index)}
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xl ml-4">
                    {case_.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{case_.name}</h4>
                    <p className="text-gray-600">{case_.age} سنة</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(case_.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="text-gray-700 italic">&quot;{case_.testimonial}&quot;</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-gray-500">العلاج</div>
                    <div className="font-bold">{case_.treatment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">المدة</div>
                    <div className="font-bold">{case_.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <a
              href={buildWhatsAppUrl("مرحباً، شاهدت نتائج ابتسامة هوليوود وأريد الحصول على نفس النتيجة")}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button inline-flex items-center"
              onClick={handleWhatsAppClick("مرحباً، شاهدت نتائج ابتسامة هوليوود وأريد الحصول على نفس النتيجة")}
            >
              <i className="fab fa-whatsapp text-2xl ml-2" />
              أريد نفس النتيجة
            </a>
          </div>
        </div>
      </section>

      {/* Shade Selection */}
      <section id="shades" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold mb-4">
              اختر درجة بياضك
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              درجات <span className="gold-shimmer">الأسنان المتاحة</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              اختر درجة البياض التي تناسب شخصيتك - من الطبيعي إلى الهوليوودي
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="shade-selector">
              {shadeGuide.map((shade) => (
                <div 
                  key={shade.code}
                  className={`shade-option ${selectedShade === shade.code ? 'selected' : ''}`}
                  onClick={() => setSelectedShade(shade.code)}
                >
                  <div 
                    className="shade-tooth"
                    style={{ backgroundColor: shade.hex }}
                  ></div>
                  <div className="shade-code">{shade.code}</div>
                  <div className="shade-name">{shade.name}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">الدرجة المختارة: {selectedShade}</h3>
                  <p className="text-gray-600 mb-4">
                    {selectedShade === 'BL1' && 'الأكثر بياضاً - مثالية لابتسامة هوليوود الكلاسيكية'}
                    {selectedShade === 'BL2' && 'بياض طبيعي مشرق - الأكثر طلباً بين عملائنا'}
                    {selectedShade === 'BL3' && 'بياض دافئ طبيعي - مناسب لجميع ألوان البشرة'}
                    {selectedShade === 'BL4' && 'بياض كريمي أنيق - للمظهر الطبيعي الراقي'}
                    {selectedShade === 'A1' && 'طبيعي فاتح - للذين يفضلون المظهر الطبيعي جداً'}
                    {selectedShade === 'A2' && 'طبيعي - الأقرب للون الأسنان الطبيعية الصحية'}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 ml-2"></i>
                      مقاومة للتصبغات والاصفرار
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 ml-2"></i>
                      تحافظ على لونها لأكثر من 15 سنة
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 ml-2"></i>
                      متوافقة مع لون بشرتك
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">😁</div>
                    <a
                      href={buildWhatsAppUrl(`مرحباً، أريد ابتسامة هوليوود بدرجة ${selectedShade}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="luxury-button inline-flex items-center"
                      onClick={handleWhatsAppClick(`مرحباً، أريد ابتسامة هوليوود بدرجة ${selectedShade}`)}
                    >
                      <i className="fab fa-whatsapp text-xl ml-2" />
                      احجز هذه الدرجة
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quiz */}
      <section id="quiz" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold mb-4">
              اختبار مجاني
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              اكتشف <span className="gold-shimmer">ابتسامتك المثالية</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              أجب على 4 أسئلة بسيطة واحصل على خطة علاج مخصصة
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="quiz-container">
              <div className="quiz-progress">
                <div 
                  className="quiz-progress-bar"
                  style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">
                  السؤال {quizStep + 1} من {quizQuestions.length}
                </h3>
                <p className="text-xl text-gray-700">
                  {quizQuestions[quizStep].question}
                </p>
              </div>
              
              <div className="space-y-4">
                {quizQuestions[quizStep].options.map((option, index) => (
                  <div
                    key={index}
                    className="quiz-option"
                    onClick={() => handleQuizAnswer(option)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{option}</span>
                      <i className="fas fa-arrow-left text-yellow-500"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold mb-4">
              باقات حصرية
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              اختر <span className="gold-shimmer">باقتك المثالية</span>
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              باقات شاملة بأسعار خاصة - تقسيط بدون فوائد متاح
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "باقة البداية",
                teeth: "8 أسنان أمامية",
                price: "2,399",
                originalPrice: "4,000",
                features: [
                  "8 قشور فينير E-MAX",
                  "تصميم ابتسامة رقمي",
                  "جلستين فقط",
                  "ضمان 10 سنوات",
                  "تبييض مجاني"
                ],
                popular: false
              },
              {
                name: "الباقة الذهبية",
                teeth: "16 سن (الفكين)",
                price: "4,799",
                originalPrice: "8,000",
                features: [
                  "16 قشرة فينير E-MAX",
                  "تصميم ابتسامة 3D",
                  "معاينة قبل التركيب",
                  "ضمان 15 سنة",
                  "تبييض + تنظيف مجاني",
                  "متابعة سنوية مجانية"
                ],
                popular: true
              },
              {
                name: "الباقة الماسية",
                teeth: "20-24 سن كامل",
                price: "5,999",
                originalPrice: "12,000",
                features: [
                  "24 قشرة فينير ألماني",
                  "تصميم هوليوود كامل",
                  "علاج اللثة إن لزم",
                  "ضمان مدى الحياة",
                  "جميع العلاجات التحضيرية",
                  "متابعة مدى الحياة",
                  "هدية: تبييض سنوي"
                ],
                popular: false
              }
            ].map((pkg, index) => (
              <div key={index} className={`relative bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 border ${pkg.popular ? 'border-yellow-400' : 'border-gray-700'} hover:transform hover:scale-105 transition-all duration-300 animate-on-scroll`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold">
                      الأكثر طلباً
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 gold-shimmer">{pkg.name}</h3>
                  <p className="text-gray-400">{pkg.teeth}</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold mb-2">{pkg.price} <span className="text-xl">د.ك</span></div>
                  <div className="text-gray-500 line-through">{pkg.originalPrice} د.ك</div>
                  <div className="price-tag mt-4">
                    وفر {parseInt(pkg.originalPrice) - parseInt(pkg.price)} د.ك
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <i className="fas fa-check-circle text-yellow-400 ml-3 mt-1"></i>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  href={buildWhatsAppUrl(`مرحباً، أريد حجز ${pkg.name} لابتسامة هوليوود بسعر ${pkg.price} د.ك`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-4 rounded-full font-bold transition-all duration-300 flex items-center justify-center ${
                    pkg.popular 
                      ? 'luxury-button' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                  onClick={handleWhatsAppClick(`مرحباً، أريد حجز ${pkg.name} لابتسامة هوليوود بسعر ${pkg.price} د.ك`)}
                >
                  <i className="fab fa-whatsapp text-xl ml-2" />
                  احجز الباقة الآن
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">أو</p>
            <a
              href={buildWhatsAppUrl("مرحباً، أريد خطة علاج مخصصة لابتسامة هوليوود")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition"
              onClick={handleWhatsAppClick("مرحباً، أريد خطة علاج مخصصة لابتسامة هوليوود")}
            >
              <i className="fas fa-comments ml-2"></i>
              احصل على خطة مخصصة
            </a>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold mb-4">
              خطوات بسيطة
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              رحلتك نحو <span className="gold-shimmer">الابتسامة المثالية</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                icon: "fas fa-comments",
                title: "الاستشارة المجانية",
                description: "فحص شامل وتصميم ابتسامة رقمي مجاناً",
                duration: "30 دقيقة"
              },
              {
                step: 2,
                icon: "fas fa-teeth",
                title: "التحضير",
                description: "تحضير الأسنان وأخذ المقاسات بدقة عالية",
                duration: "ساعة واحدة"
              },
              {
                step: 3,
                icon: "fas fa-flask",
                title: "التصنيع",
                description: "تصنيع القشور في أفضل المختبرات الألمانية",
                duration: "5-7 أيام"
              },
              {
                step: 4,
                icon: "fas fa-smile",
                title: "التركيب النهائي",
                description: "تركيب القشور والحصول على ابتسامتك الجديدة",
                duration: "ساعتين"
              }
            ].map((process, index) => (
              <div key={index} className="text-center animate-on-scroll">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    <i className={process.icon}></i>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                    {process.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{process.title}</h3>
                <p className="text-gray-600 mb-2">{process.description}</p>
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  <i className="fas fa-clock ml-1"></i>
                  {process.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section id="guarantee" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="guarantee-badge animate-on-scroll">
              <div className="text-center">
                <i className="fas fa-shield-alt text-6xl mb-4"></i>
                <h2 className="text-3xl font-bold mb-4">ضمان الرضا 100%</h2>
                <p className="text-xl mb-8">
                  نضمن لك النتيجة أو استرجاع كامل المبلغ
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                  <div>
                    <i className="fas fa-certificate text-4xl mb-3"></i>
                    <h4 className="font-bold mb-2">ضمان 15 سنة</h4>
                    <p className="text-sm opacity-90">على جميع قشور الفينير</p>
                  </div>
                  <div>
                    <i className="fas fa-undo text-4xl mb-3"></i>
                    <h4 className="font-bold mb-2">ضمان الاسترجاع</h4>
                    <p className="text-sm opacity-90">خلال 30 يوم إذا لم تعجبك النتيجة</p>
                  </div>
                  <div>
                    <i className="fas fa-user-md text-4xl mb-3"></i>
                    <h4 className="font-bold mb-2">متابعة مجانية</h4>
                    <p className="text-sm opacity-90">فحوصات دورية مجانية لمدة سنتين</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <a
                    href={buildWhatsAppUrl("مرحباً، أريد معرفة المزيد عن ضمان ابتسامة هوليوود")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-green-600 hover:bg-gray-100 transition-all duration-300 px-8 py-4 rounded-full font-bold inline-flex items-center"
                    onClick={handleWhatsAppClick("مرحباً، أريد معرفة المزيد عن ضمان ابتسامة هوليوود")}
                  >
                    <i className="fab fa-whatsapp text-xl ml-2" />
                    تحدث مع خبير الآن
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              الأسئلة <span className="gold-shimmer">الشائعة</span>
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto grid gap-6">
            {[
              {
                q: "هل ابتسامة هوليوود مؤلمة؟",
                a: "لا، العملية غير مؤلمة تماماً. نستخدم التخدير الموضعي ولا تحتاج لأكثر من جلستين"
              },
              {
                q: "كم تدوم ابتسامة هوليوود؟",
                a: "مع العناية الصحيحة، تدوم قشور الفينير 15-20 سنة أو أكثر"
              },
              {
                q: "هل يمكن إزالة الفينير لاحقاً؟",
                a: "الفينير دائم لأنه يتطلب برد بسيط للأسنان، لكن يمكن استبداله بفينير جديد"
              },
              {
                q: "ما الفرق بين الفينير واللومينير؟",
                a: "الفينير أقوى وأكثر تغطية للعيوب، بينما اللومينير أرق ولا يحتاج برد كثير"
              },
              {
                q: "هل يمكن التقسيط؟",
                a: "نعم، نوفر خطط تقسيط مريحة بدون فوائد حتى 12 شهر"
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 animate-on-scroll">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <i className="fas fa-question-circle text-yellow-500 ml-3"></i>
                  {faq.q}
                </h3>
                <p className="text-gray-700 pr-9">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 luxury-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ابدأ رحلتك نحو <span className="gold-shimmer">الابتسامة المثالية</span>
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              انضم لأكثر من 5,000 شخص حصلوا على ابتسامة أحلامهم معنا
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={buildWhatsAppUrl("مرحباً، أريد البدء بابتسامة هوليوود الآن")}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-button inline-flex items-center justify-center"
                onClick={handleWhatsAppClick("مرحباً، أريد البدء بابتسامة هوليوود الآن")}
              >
                <i className="fab fa-whatsapp text-2xl ml-2" />
                احجز استشارتك المجانية الآن
              </a>
              <a
                href="tel:+96555200604"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 rounded-full font-bold inline-flex items-center justify-center"
              >
                <i className="fas fa-phone-alt ml-2"></i>
                اتصل الآن: 5520 0604
              </a>
            </div>
            
            <div className="mt-12 flex justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-400 text-xl"></i>
                <span>استشارة مجانية</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-400 text-xl"></i>
                <span>خصم 40% لفترة محدودة</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-400 text-xl"></i>
                <span>ضمان 15 سنة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4">
              <span className="gold-shimmer">Hollywood Smile Kuwait</span>
            </div>
            <p className="mb-6 opacity-80">عيادة ماي دكتور - رائدون في ابتسامة هوليوود منذ 2009</p>
            
            <div className="flex justify-center gap-6 mb-8">
              <a href={buildWhatsAppUrl("مرحباً")} target="_blank" rel="noopener noreferrer" 
                 className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition"
                 onClick={handleWhatsAppClick("مرحباً")}>
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full flex items-center justify-center transition">
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
              <div>
                <i className="fas fa-map-marker-alt text-yellow-400 mb-2"></i>
                <p>السالمية، الكويت</p>
              </div>
              <div>
                <i className="fas fa-phone-alt text-yellow-400 mb-2"></i>
                <p className="direction-ltr">+965 5520 0604</p>
              </div>
              <div>
                <i className="fas fa-clock text-yellow-400 mb-2"></i>
                <p>9 صباحاً - 9 مساءً</p>
              </div>
            </div>
            
            <hr className="border-gray-800 my-8" />
            
            <p className="opacity-60">© 2025 Hollywood Smile Kuwait - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

      {/* Floating Badge */}
      <div className="floating-badge">
        <i className="fas fa-gift ml-2"></i>
        خصم 40% ينتهي قريباً
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={buildWhatsAppUrl("مرحباً، أريد الحصول على ابتسامة هوليوود")}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-luxury"
        onClick={handleWhatsAppClick("مرحباً، أريد الحصول على ابتسامة هوليوود")}
      >
        <i className="fab fa-whatsapp text-white text-3xl" />
      </a>

      {/* Limited Time Offer Modal */}
      {showOfferModal && (
        <div className="luxury-modal" onClick={() => setShowOfferModal(false)}>
          <div className="luxury-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowOfferModal(false)}
            >
              <i className="fas fa-times text-2xl"></i>
            </button>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-crown text-white text-4xl"></i>
              </div>

              <h3 className="text-3xl font-bold mb-4">عرض حصري لك!</h3>
              <p className="text-gray-600 mb-6 text-lg">
                احصل على <strong>استشارة مجانية</strong> + <strong>خصم 40%</strong> على ابتسامة هوليوود
              </p>

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <div className="text-red-600 font-bold mb-3 text-xl">العرض ينتهي خلال:</div>
                <div className="flex justify-center gap-4">
                  <div className="bg-red-500 text-white rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold">48</div>
                    <div className="text-xs">ساعة</div>
                  </div>
                  <div className="bg-red-500 text-white rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold">00</div>
                    <div className="text-xs">دقيقة</div>
                  </div>
                  <div className="bg-red-500 text-white rounded-xl px-4 py-3">
                    <div className="text-2xl font-bold">00</div>
                    <div className="text-xs">ثانية</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <i className="fas fa-teeth text-3xl text-yellow-500 mb-2"></i>
                  <p className="text-sm">20 فينير</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-percentage text-3xl text-green-500 mb-2"></i>
                  <p className="text-sm">خصم 40%</p>
                </div>
                <div className="text-center">
                  <i className="fas fa-shield-alt text-3xl text-blue-500 mb-2"></i>
                  <p className="text-sm">ضمان 15 سنة</p>
                </div>
              </div>

              <a
                href={buildWhatsAppUrl("مرحباً، أريد الاستفادة من العرض الحصري - استشارة مجانية + خصم 40% على ابتسامة هوليوود")}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-button w-full flex items-center justify-center"
                onClick={handleWhatsAppClick("مرحباً، أريد الاستفادة من العرض الحصري - استشارة مجانية + خصم 40% على ابتسامة هوليوود")}
              >
                <i className="fab fa-whatsapp text-2xl ml-2"></i>
                احصل على العرض الآن
              </a>

              <p className="text-gray-500 text-sm mt-4">
                <i className="fas fa-lock ml-1"></i>
                معلوماتك آمنة ومحمية 100%
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
