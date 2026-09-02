import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Switch } from '../components/ui/switch';

export default function CookiesSettings() {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  const handleToggle = (key: keyof typeof cookieSettings) => {
    if (key === 'necessary') return; // Necessary cookies cannot be disabled
    setCookieSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    alert('Cookie settings saved!');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[rgba(10,10,10,0.8)] backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-[#0b6e4f] dark:text-[#10b981] hover:opacity-80 transition-opacity">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Cookie Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12">
              Manage your cookie preferences
            </p>

            <div className="space-y-6">
              {/* Necessary Cookies */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-[24px] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Necessary Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      These cookies are essential for the website to function properly. 
                      They enable basic functions like page navigation and access to secure areas.
                    </p>
                  </div>
                  <Switch
                    checked={cookieSettings.necessary}
                    disabled
                    className="ml-4"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Always enabled
                </p>
              </div>

              {/* Functional Cookies */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-[24px] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Functional Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      These cookies enable enhanced functionality and personalization, 
                      such as remembering your preferences and settings.
                    </p>
                  </div>
                  <Switch
                    checked={cookieSettings.functional}
                    onCheckedChange={() => handleToggle('functional')}
                    className="ml-4"
                  />
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-[24px] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Analytics Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      These cookies help us understand how visitors interact with our website, 
                      helping us improve user experience and identify technical issues.
                    </p>
                  </div>
                  <Switch
                    checked={cookieSettings.analytics}
                    onCheckedChange={() => handleToggle('analytics')}
                    className="ml-4"
                  />
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-[24px] p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Marketing Cookies
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      These cookies track your online activity to help advertisers deliver 
                      more relevant advertising or to limit how many times you see an ad.
                    </p>
                  </div>
                  <Switch
                    checked={cookieSettings.marketing}
                    onCheckedChange={() => handleToggle('marketing')}
                    className="ml-4"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSaveSettings}
                  className="px-[32px] py-[16px] rounded-[48px] font-medium text-white transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
                  style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)" }}
                >
                  Save Preferences
                </button>
              </div>

              {/* Additional Information */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  What are cookies?
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device 
                  when you visit a website. They are widely used to make websites work more efficiently 
                  and provide information to website owners.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  For more information about how we use cookies, please read our{' '}
                  <Link to="/privacy" className="text-[#0b6e4f] dark:text-[#10b981] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}