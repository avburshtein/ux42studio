import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function FloatingButtons() {
  const [showChat, setShowChat] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure component is mounted before creating portal
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  // Close chat when route changes
  useEffect(() => {
    setShowChat(false);
  }, [location.pathname]);

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleQuickAction = (action: string) => {
    setShowChat(false);
    switch (action) {
      case 'services':
        navigate('/services');
        break;
      case 'portfolio':
        navigate('/portfolio');
        break;
      case 'contact':
        // Scroll to footer/contact section on home page
        if (location.pathname === '/') {
          const footer = document.querySelector('footer');
          footer?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            const footer = document.querySelector('footer');
            footer?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
        break;
      case 'faq':
        // Scroll to FAQ section if on services page, otherwise go to services
        if (location.pathname === '/services') {
          const faq = document.querySelector('[data-section="faq"]');
          faq?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/services');
        }
        break;
    }
  };

  // Don't render until mounted (SSR safety)
  if (!mounted) return null;

  // Get or create portal target
  let portalTarget = document.getElementById('floating-buttons-portal');
  if (!portalTarget) {
    console.log('⚙️ Creating floating-buttons-portal...');
    portalTarget = document.createElement('div');
    portalTarget.id = 'floating-buttons-portal';
    document.body.appendChild(portalTarget);
  }

  const assistantButtonStyle: React.CSSProperties = {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: 'none',
    backgroundImage: 'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
    boxShadow: '2px 2px 8px 0px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    zIndex: 9999999,
  };

  const chatWindowStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '110px',
    right: '24px',
    width: '380px',
    maxWidth: 'calc(100vw - 48px)',
    zIndex: 9999998,
  };

  const content = (
    <>
      {/* Virtual Assistant Button */}
      <button
        type="button"
        onClick={toggleChat}
        style={assistantButtonStyle}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '4px 4px 12px 0px rgba(11,110,79,0.4)';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 8px 0px rgba(0,0,0,0.15)';
        }}
        aria-label="Open virtual assistant"
      >
        {/* Animated pulse ring */}
        <span 
          style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '50%',
            backgroundColor: '#0b6e4f',
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.2,
          }}
        />
        
        {showChat ? (
          <X style={{ width: '24px', height: '24px', position: 'relative', zIndex: 10 }} />
        ) : (
          <MessageCircle style={{ width: '24px', height: '24px', position: 'relative', zIndex: 10 }} />
        )}
      </button>

      {/* Chat Window */}
      {showChat && (
        <div style={chatWindowStyle} className="animate-scaleIn">
          <div className="bg-white dark:bg-[rgba(30,30,30,0.98)] backdrop-blur-xl rounded-[24px] shadow-[0_20px_60px_0px_rgba(0,0,0,0.3)] overflow-hidden transition-colors duration-300">
            
            {/* Chat Header */}
            <div 
              className="px-[24px] py-[20px] text-white relative overflow-hidden"
              style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[40px] h-[40px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <MessageCircle className="w-[20px] h-[20px]" />
                  </div>
                  <div>
                    <p className="font-['Poppins:Medium',sans-serif] text-[16px]">Virtual Assistant</p>
                    <div className="flex items-center gap-[6px]">
                      <span className="w-[8px] h-[8px] rounded-full bg-[#4ade80] animate-pulse" />
                      <p className="font-['Inter:Regular',sans-serif] text-[12px] text-white/80">Online</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Chat Body */}
            <div className="p-[24px] flex flex-col gap-[16px] max-h-[400px] overflow-y-auto">
              
              {/* Welcome Message */}
              <div className="flex gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#0b6e4f] to-[#2c5a07] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-[16px] h-[16px] text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#f3f4f6] dark:bg-[rgba(40,40,40,0.8)] rounded-[16px] rounded-tl-[4px] px-[16px] py-[12px]">
                    <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 leading-[1.5]">
                      Hello! 👋 I'm your virtual assistant. How can I help you today?
                    </p>
                  </div>
                  <p className="font-['Inter:Regular',sans-serif] text-[11px] text-gray-500 dark:text-gray-500 mt-[4px] ml-[4px]">
                    Just now
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Inter:Medium',sans-serif] text-[12px] text-gray-600 dark:text-gray-400 ml-[4px]">
                  Quick actions:
                </p>
                <div className="grid grid-cols-1 gap-[8px]">
                  <button
                    className="px-[16px] py-[10px] rounded-[12px] bg-[#f3f4f6] dark:bg-[rgba(40,40,40,0.8)] text-left font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[rgba(50,50,50,0.9)] transition-colors duration-200"
                    onClick={() => handleQuickAction('services')}
                  >
                    📋 View Services & Pricing
                  </button>
                  <button
                    className="px-[16px] py-[10px] rounded-[12px] bg-[#f3f4f6] dark:bg-[rgba(40,40,40,0.8)] text-left font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[rgba(50,50,50,0.9)] transition-colors duration-200"
                    onClick={() => handleQuickAction('portfolio')}
                  >
                    💼 Check Portfolio
                  </button>
                  <button
                    className="px-[16px] py-[10px] rounded-[12px] bg-[#f3f4f6] dark:bg-[rgba(40,40,40,0.8)] text-left font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[rgba(50,50,50,0.9)] transition-colors duration-200"
                    onClick={() => handleQuickAction('contact')}
                  >
                    📞 Contact Us
                  </button>
                  <button
                    className="px-[16px] py-[10px] rounded-[12px] bg-[#f3f4f6] dark:bg-[rgba(40,40,40,0.8)] text-left font-['Inter:Regular',sans-serif] text-[13px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 hover:bg-[#e5e7eb] dark:hover:bg-[rgba(50,50,50,0.9)] transition-colors duration-200"
                    onClick={() => handleQuickAction('faq')}
                  >
                    ❓ FAQ & Support
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-[16px] border-t border-gray-200 dark:border-[rgba(255,255,255,0.1)]">
              <div className="flex gap-[8px]">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-[16px] py-[10px] rounded-[12px] bg-[#f3f4f6] dark:bg-[rgba(40,40,40,0.8)] border-0 outline-none font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#0b6e4f]/30 transition-all duration-200"
                />
                <button 
                  className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-white transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
                  aria-label="Send message"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="font-['Inter:Regular',sans-serif] text-[10px] text-gray-500 dark:text-gray-500 mt-[8px] text-center">
                Powered by AI • Available 24/7
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(content, portalTarget);
}