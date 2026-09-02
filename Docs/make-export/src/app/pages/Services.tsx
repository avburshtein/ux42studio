import { Globe, Palette, Search, Smartphone, BarChart, MessageSquare, Clock, DollarSign, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface Service {
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  price: string;
  duration: string;
  popular?: boolean;
}

export default function Services() {
  const services: Service[] = [
    {
      icon: Globe,
      title: 'Web Development',
      subtitle: 'Custom Websites & Web Apps',
      description: 'Creating modern websites and web applications using cutting-edge technologies. Responsive design, high performance, and excellent user experience.',
      features: [
        'Responsive design for all devices',
        'Performance optimization',
        'SEO optimization',
        'CMS integration',
        'Support and maintenance',
      ],
      price: 'from €1,500',
      duration: '4-8 weeks',
      popular: true,
    },
    {
      icon: Palette,
      title: 'Brand Design',
      subtitle: 'Corporate Identity & Branding',
      description: 'Comprehensive brand identity development including logo, color palette, typography, and brand guidelines for consistent visual communication.',
      features: [
        'Logo design',
        'Corporate identity',
        'Brand book and guidelines',
        'Packaging design',
        'Marketing materials',
      ],
      price: 'from €800',
      duration: '3-5 weeks',
    },
    {
      icon: Search,
      title: 'SEO Optimization',
      subtitle: 'Search Engine Optimization',
      description: 'Strategic search engine optimization to improve rankings and drive organic traffic to your website through data-driven techniques.',
      features: [
        'Technical site audit',
        'Keyword research',
        'Content optimization',
        'Link building',
        'Monthly reporting',
      ],
      price: 'from €500/month',
      duration: '3-6 months',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      subtitle: 'iOS & Android Development',
      description: 'Development of native and cross-platform mobile applications for iOS and Android with intuitive interfaces and seamless user experience.',
      features: [
        'iOS and Android development',
        'Cross-platform solutions',
        'UI/UX design',
        'API integration',
        'App Store / Play Store publishing',
      ],
      price: 'from €3,000',
      duration: '8-16 weeks',
      popular: true,
    },
    {
      icon: BarChart,
      title: 'Digital Marketing',
      subtitle: 'Online Marketing & Advertising',
      description: 'Comprehensive data-driven marketing strategies to grow your online presence and reach your target audience effectively.',
      features: [
        'PPC advertising (Google, Yandex)',
        'Social media marketing',
        'Email marketing',
        'Content marketing',
        'Analytics and reporting',
      ],
      price: 'from €400/month',
      duration: 'from 3 months',
    },
    {
      icon: MessageSquare,
      title: 'Consulting',
      subtitle: 'Digital Strategy & Advisory',
      description: 'Expert consulting on digital strategy, technology stack selection, and process optimization to drive business growth and efficiency.',
      features: [
        'Current process audit',
        'Digital strategy development',
        'Technology selection',
        'Budget optimization',
        'Team training',
      ],
      price: 'from €150/hour',
      duration: 'custom',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/70 to-[#fbfffa]/70 dark:from-[#0f0f0f]/70 dark:to-[#1a1a1a]/70 transition-colors duration-300">
      {/* Fixed Back Button */}
      <div className="fixed top-[24px] left-[24px] z-50">
        <Link
          to="/"
          className="flex items-center gap-[8px] px-[20px] py-[12px] bg-white/90 dark:bg-[rgba(40,40,40,0.9)] backdrop-blur-sm rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] text-[#0b6e4f] dark:text-[#10b981] shadow-[2px_2px_8px_0px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-[120px] md:pt-[140px] pb-[80px] px-[24px]">
        <div className="max-w-[1200px] mx-auto">
          {/* Title and Description */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-['Poppins:SemiBold',sans-serif] text-[48px] md:text-[72px] leading-[1.1] text-[rgba(18,21,14,0.71)] dark:text-white mb-[24px]">
                Our Services
              </h1>
              <p className="font-['Inter:Regular',sans-serif] text-[18px] md:text-[20px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 max-w-[800px] mx-auto mb-[40px]">
                Comprehensive digital solutions to grow your business. From concept to implementation and support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-[100px] px-[24px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[32px] p-[32px] md:p-[40px] shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] hover:shadow-[12px_12px_30px_0px_rgba(11,110,79,0.15)] dark:hover:shadow-[12px_12px_30px_0px_rgba(11,110,79,0.2)] transition-all duration-300 hover:-translate-y-2"
                >
                  {service.popular && (
                    <div className="absolute top-[24px] right-[24px] px-[16px] py-[6px] bg-gradient-to-r from-[#0b6e4f] to-[#2c5a07] rounded-[24px]">
                      <span className="font-['Inter:Medium',sans-serif] text-[12px] text-white uppercase tracking-wider">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-[64px] h-[64px] rounded-[20px] bg-gradient-to-br from-[#0b6e4f] to-[#2c5a07] flex items-center justify-center mb-[24px] shadow-lg">
                    <Icon size={32} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[28px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[8px]">
                    {service.title}
                  </h3>
                  <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[#0b6e4f] dark:text-[#10b981] mb-[16px] uppercase tracking-wider">
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 mb-[24px] leading-[1.6]">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-[24px] space-y-[12px]">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-[12px]">
                        <div className="w-[20px] h-[20px] rounded-full bg-[#0b6e4f]/10 dark:bg-[#0b6e4f]/20 flex items-center justify-center flex-shrink-0 mt-[2px]">
                          <Check size={12} className="text-[#0b6e4f] dark:text-[#10b981]" />
                        </div>
                        <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Price and Duration */}
                  <div className="flex items-center justify-between pt-[24px] border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-[8px]">
                      <DollarSign size={20} className="text-[#0b6e4f] dark:text-[#10b981]" />
                      <span className="font-['Inter:SemiBold',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white">
                        {service.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <Clock size={20} className="text-[#0b6e4f] dark:text-[#10b981]" />
                      <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-gray-400">
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-[100px] px-[24px]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gradient-to-br from-[#0b6e4f] to-[#2c5a07] rounded-[32px] p-[48px] md:p-[64px] text-center shadow-[12px_12px_30px_0px_rgba(11,110,79,0.2)]"
          >
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[32px] md:text-[48px] text-white mb-[16px]">
              Need a Custom Solution?
            </h2>
            <p className="font-['Inter:Regular',sans-serif] text-[18px] text-white/90 mb-[32px] max-w-[600px] mx-auto">
              We specialize in creating tailored solutions. Let's discuss your unique requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-[16px] justify-center">
              <Link
                to="/"
                className="px-[40px] py-[16px] bg-white text-[#0b6e4f] rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] hover:shadow-[4px_4px_12px_0px_rgba(0,0,0,0.2)] transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Contact Us
              </Link>
              <Link
                to="/portfolio"
                className="px-[40px] py-[16px] bg-transparent border-2 border-white text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-[100px] px-[24px]" data-section="faq">
        <div className="max-w-[800px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center mb-[48px]"
          >
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[36px] md:text-[48px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[16px]">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-[24px]">
            {[
              {
                question: 'How is the project cost determined?',
                answer: 'The cost depends on the scope of work, task complexity, and delivery timeline. After discussing your requirements, we provide a detailed estimate with breakdown by stages.',
              },
              {
                question: 'Do you provide support after launch?',
                answer: 'Yes, we offer various technical support and maintenance packages. This includes bug fixes, content updates, consultations, and project development.',
              },
              {
                question: 'Can the payment be split into stages?',
                answer: 'Yes, we work with a milestone-based payment system. Typically it\'s 30% upfront, 40% after design approval, and 30% after project delivery.',
              },
              {
                question: 'How long does a typical project take?',
                answer: 'Timelines depend on project scope. A landing page takes 2-3 weeks, a corporate website 4-6 weeks, and a complex web application 3-6 months.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] p-[32px] shadow-[4px_4px_12px_0px_rgba(0,0,0,0.05)] dark:shadow-[4px_4px_12px_0px_rgba(255,255,255,0.02)]"
              >
                <h3 className="font-['Inter:SemiBold',sans-serif] text-[18px] text-[rgba(18,21,14,0.71)] dark:text-white mb-[12px]">
                  {faq.question}
                </h3>
                <p className="font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 leading-[1.6]">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}