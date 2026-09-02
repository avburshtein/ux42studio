import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12">
              Last updated: February 17, 2026
            </p>

            <div className="space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms of Service 
                  and all applicable laws and regulations. If you do not agree with any of these terms, 
                  you are prohibited from using or accessing our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Use License
                </h2>
                <p className="mb-4">
                  We grant you a limited, non-exclusive, non-transferable license to use our services 
                  for your personal or business purposes. This license does not include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modifying or copying our materials</li>
                  <li>Using materials for commercial purposes without authorization</li>
                  <li>Attempting to reverse engineer any software</li>
                  <li>Removing copyright or proprietary notations</li>
                  <li>Transferring materials to another person</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Service Description
                </h2>
                <p>
                  We provide web development, design, and branding services. Our services include 
                  but are not limited to website design and development, brand identity creation, 
                  digital marketing, and consultation services. Specific deliverables will be outlined 
                  in individual project agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. User Responsibilities
                </h2>
                <p className="mb-4">
                  You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account</li>
                  <li>Use services in compliance with all applicable laws</li>
                  <li>Not interfere with or disrupt our services</li>
                  <li>Respect intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Payment Terms
                </h2>
                <p>
                  Payment terms will be specified in individual project agreements. Generally, 
                  we require a deposit before commencing work, with the balance due upon completion 
                  or according to agreed milestones. Late payments may incur additional fees.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Intellectual Property
                </h2>
                <p>
                  All content, features, and functionality of our services are owned by us or 
                  our licensors and are protected by international copyright, trademark, and other 
                  intellectual property laws. Upon full payment, clients receive agreed-upon rights 
                  to deliverables as specified in project agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Limitation of Liability
                </h2>
                <p>
                  We shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages resulting from your use of or inability to use our services. 
                  Our total liability shall not exceed the amount paid by you for the specific service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Termination
                </h2>
                <p>
                  We reserve the right to terminate or suspend access to our services immediately, 
                  without prior notice, for any breach of these Terms. Upon termination, your right 
                  to use the services will cease immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Changes to Terms
                </h2>
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of 
                  any material changes. Your continued use of services after changes constitutes 
                  acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Contact Information
                </h2>
                <p>
                  For questions about these Terms of Service, please contact us at:{' '}
                  <a href="mailto:legal@example.com" className="text-[#0b6e4f] dark:text-[#10b981] hover:underline">
                    legal@example.com
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