import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function Portfolio() {
  const projects = [
    {
      id: 1,
      title: 'Modern E-commerce Platform',
      category: 'Web Design',
      image: 'https://images.unsplash.com/photo-1763437153598-78b5579ddefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWJzaXRlJTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc3MTE4MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'A comprehensive e-commerce platform with intuitive user experience, seamless checkout process, and modern design aesthetics.',
      projectSlug: 'modern-ecommerce-platform',
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'App Design',
      image: 'https://images.unsplash.com/photo-1661246627162-feb0269e0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzcxMTUxNDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Secure and user-friendly mobile banking application featuring advanced financial management tools.',
      projectSlug: 'mobile-banking-app',
    },
    {
      id: 3,
      title: 'Brand Identity System',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1640975972263-1f73398e943b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzcxMTgxMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Complete brand identity system including logo design, color palette, and typography guidelines.',
      projectSlug: 'brand-identity-system',
    },
    {
      id: 4,
      title: 'Creative Poster Series',
      category: 'Graphic Design',
      image: 'https://images.unsplash.com/photo-1654865433650-23e71f161b64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwcG9zdGVyfGVufDF8fHx8MTc3MTIwNzczNHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Eye-catching poster series combining bold typography, vibrant colors, and creative layouts.',
      projectSlug: 'creative-poster-series',
    },
    {
      id: 5,
      title: 'Online Store Interface',
      category: 'Web Design',
      image: 'https://images.unsplash.com/photo-1694599048261-a1de00f0117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwZGVzaWdufGVufDF8fHx8MTc3MTIxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Shopify-powered online store with clean product presentation and advanced filtering options.',
      projectSlug: 'online-store-interface',
    },
    {
      id: 6,
      title: 'Product Packaging Design',
      category: 'Packaging',
      image: 'https://images.unsplash.com/photo-1668775589980-58f9f0021ce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBwcm9kdWN0fGVufDF8fHx8MTc3MTE3NDU0OHww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Innovative packaging design that combines sustainability with aesthetics.',
      projectSlug: 'product-packaging-design',
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
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-['Poppins:SemiBold',sans-serif] text-5xl md:text-6xl text-[rgba(18,21,14,0.71)] dark:text-white mb-6"
          >
            Our Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-['Inter:Regular',sans-serif] text-xl text-[rgba(18,21,14,0.71)] dark:text-gray-400 max-w-3xl mx-auto"
          >
            Explore our latest projects and see how we bring ideas to life with cutting-edge technology and creative design.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex"
              >
                <Link to={`/portfolio/${project.projectSlug}`} className="flex flex-col w-full">
                  <div className="group bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] overflow-hidden shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_30px_0px_rgba(11,110,79,0.15)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)] flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="font-['Inter:Medium',sans-serif] text-sm text-[#0b6e4f] dark:text-[#10b981] mb-2">
                        {project.category}
                      </p>
                      {/* Fixed height for titles - matching the longest title */}
                      <h3 className="font-['Poppins:SemiBold',sans-serif] text-2xl text-[rgba(18,21,14,0.71)] dark:text-white mb-2 min-h-[64px] flex items-center">
                        {project.title}
                      </h3>
                      <p className="font-['Inter:Regular',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 leading-[1.6]">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
