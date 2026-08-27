import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Globe, Palette, Search, Smartphone, BarChart, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServicesModal({ isOpen, onClose }: ServicesModalProps) {
  const services = [
    {
      icon: Globe,
      title: 'Web Development',
      description: 'Custom websites built with modern technologies for optimal performance and user experience.',
    },
    {
      icon: Palette,
      title: 'Brand Design',
      description: 'Comprehensive brand identity design including logos, color schemes, and style guides.',
    },
    {
      icon: Search,
      title: 'SEO Optimization',
      description: 'Strategic SEO to improve your search rankings and drive organic traffic to your site.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
    },
    {
      icon: BarChart,
      title: 'Digital Marketing',
      description: 'Data-driven marketing strategies to grow your online presence and reach your audience.',
    },
    {
      icon: MessageSquare,
      title: 'Consulting',
      description: 'Expert advice on digital strategy, technology stack, and growth optimization.',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-[24px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto modal-scrollbar">
        <div className="relative">
          
          <DialogHeader className="px-8 pt-8 pb-6">
            <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              Our Services
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
              We offer comprehensive digital solutions to help your business thrive
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-[24px] p-6 hover:shadow-lg dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0b6e4f] to-[#2c5a07] flex items-center justify-center mb-4">
                      <Icon size={24} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {service.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-[#0b6e4f]/10 to-[#2c5a07]/10 dark:from-[#0b6e4f]/20 dark:to-[#2c5a07]/20 rounded-[24px]">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Want to learn more?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                View detailed information about all services with prices and timelines
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/services"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 px-[32px] py-[16px] rounded-[48px] font-medium text-white transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
                  style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 1) 3.7608%, rgba(44, 90, 7, 1) 98.529%)" }}
                >
                  All Services & Prices
                  <ArrowRight size={20} />
                </Link>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-[32px] py-[16px] rounded-[48px] font-medium text-[#0b6e4f] dark:text-[#10b981] bg-white dark:bg-gray-800 border-2 border-[#0b6e4f] dark:border-[#10b981] transition-all duration-300 hover:bg-[#0b6e4f] hover:text-white dark:hover:bg-[#10b981] dark:hover:text-gray-900 hover:scale-105 active:scale-95"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}