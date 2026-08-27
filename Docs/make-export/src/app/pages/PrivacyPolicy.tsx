import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12">
              Last updated: February 17, 2026
            </p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information you provide directly to us, including when you create an account, 
                  fill out a form, or communicate with us. This may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information</li>
                  <li>Email address</li>
                  <li>Company information</li>
                  <li>Project requirements and preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Communicate with you about projects and services</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Send you updates and marketing communications (with your consent)</li>
                  <li>Analyze usage patterns and improve user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Information Sharing
                </h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>With service providers who assist in our operations</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Your Rights
                </h2>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Cookies and Tracking
                </h2>
                <p>
                  We use cookies and similar tracking technologies to improve your experience on our website. 
                  You can control cookie settings through your browser preferences. For more information, 
                  see our <Link to="/cookies" className="text-[#0b6e4f] dark:text-[#10b981] hover:underline">Cookie Settings</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:{' '}
                  <a href="mailto:privacy@example.com" className="text-[#0b6e4f] dark:text-[#10b981] hover:underline">
                    privacy@example.com
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}