import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router';
import { getStoredProjects } from '../utils/projectStorage';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  tags: string[];
  description?: string;
  projectSlug?: string;
  liveUrl?: string;
}

const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: 'Modern E-commerce Platform',
    category: 'Web Design',
    image: 'https://images.unsplash.com/photo-1763437153598-78b5579ddefa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWJzaXRlJTIwZGVzaWduJTIwbW9ja3VwfGVufDF8fHx8MTc3MTE4MjE5OXww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['UI/UX', 'E-commerce', 'Responsive'],
    description: 'A comprehensive e-commerce platform with intuitive user experience, seamless checkout process, and modern design aesthetics. Built with scalability and performance in mind.',
    projectSlug: 'modern-ecommerce-platform',
    liveUrl: 'https://example.com/ecommerce-demo'
  },
  {
    id: 2,
    title: 'Mobile Banking App',
    category: 'App Design',
    image: 'https://images.unsplash.com/photo-1661246627162-feb0269e0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ258ZW58MXx8fHwxNzcxMTUxNDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Mobile', 'Fintech', 'iOS'],
    description: 'Secure and user-friendly mobile banking application featuring advanced financial management tools, real-time notifications, and biometric authentication.',
    projectSlug: 'mobile-banking-app',
    liveUrl: 'https://example.com/banking-demo'
  },
  {
    id: 3,
    title: 'Brand Identity System',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1640975972263-1f73398e943b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzcxMTgxMzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Logo', 'Brand Guidelines', 'Identity'],
    description: 'Complete brand identity system including logo design, color palette, typography, and comprehensive brand guidelines for consistent visual communication.',
    projectSlug: 'brand-identity-system',
    liveUrl: 'https://example.com/brand-demo'
  },
  {
    id: 4,
    title: 'Creative Poster Series',
    category: 'Graphic Design',
    image: 'https://images.unsplash.com/photo-1654865433650-23e71f161b64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwaGljJTIwZGVzaWduJTIwcG9zdGVyfGVufDF8fHx8MTc3MTIwNzczNHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Print', 'Typography', 'Art Direction'],
    description: 'Eye-catching poster series combining bold typography, vibrant colors, and creative layouts for maximum visual impact and brand awareness.',
    projectSlug: 'creative-poster-series',
    liveUrl: 'https://example.com/poster-demo'
  },
  {
    id: 5,
    title: 'Online Store Interface',
    category: 'Web Design',
    image: 'https://images.unsplash.com/photo-1694599048261-a1de00f0117e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjB3ZWJzaXRlJTIwZGVzaWdufGVufDF8fHx8MTc3MTIxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Shopify', 'Product Design', 'UI'],
    description: 'Shopify-powered online store with clean product presentation, advanced filtering options, and optimized conversion funnels for increased sales.',
    projectSlug: 'online-store-interface',
    liveUrl: 'https://example.com/store-demo'
  },
  {
    id: 6,
    title: 'Product Packaging Design',
    category: 'Packaging',
    image: 'https://images.unsplash.com/photo-1668775589980-58f9f0021ce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNrYWdpbmclMjBkZXNpZ24lMjBwcm9kdWN0fGVufDF8fHx8MTc3MTE3NDU0OHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Packaging', '3D', 'Branding'],
    description: 'Innovative packaging design that combines sustainability with aesthetics, creating memorable unboxing experiences and strong shelf presence.',
    projectSlug: 'product-packaging-design',
    liveUrl: 'https://example.com/packaging-demo'
  }
];

const categories = ['All', 'Web Design', 'App Design', 'UX Research'];

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [allItems, setAllItems] = useState<PortfolioItem[]>(portfolioItems);

  useEffect(() => {
    const stored = getStoredProjects();
    const mapped: PortfolioItem[] = stored.map((p, i) => ({
      id: 1000 + i,
      title: p.title,
      category: p.category,
      image: p.heroImage,
      tags: p.tags?.filter(Boolean) ?? [p.category],
      description: p.overview,
      projectSlug: p.slug,
    }));
    setAllItems([...mapped, ...portfolioItems]);
  }, []);

  const filteredItems = activeCategory === 'All'
    ? allItems
    : allItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md relative shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] shrink-0 w-full transition-colors duration-300">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center px-[24px] md:px-[48px] lg:px-[64px] py-[80px] md:py-[100px] lg:py-[120px] relative w-full">
          <div className="content-stretch flex flex-col gap-[60px] items-center max-w-[1280px] relative shrink-0 w-full">
            
            {/* Section Title */}
            <div className="content-stretch flex flex-col gap-[24px] items-center max-w-[768px] not-italic relative shrink-0 text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-center w-full whitespace-pre-wrap">
              <p className="font-['Inter:Semi_Bold',sans-serif] text-[16px] text-[#070309] dark:text-white">Work</p>
              <p className="font-['Poppins:Medium',sans-serif] leading-[1.2] relative shrink-0 text-[32px] md:text-[42px] lg:text-[52px] tracking-[-0.52px] w-full">Portfolio</p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[16px] md:text-[18px] w-full mb-0">
                Explore our best work in web design, branding, and digital products
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-[12px] items-center justify-center w-full">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-[24px] py-[12px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] md:text-[16px] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                    activeCategory === category
                      ? 'text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)]'
                      : 'bg-white dark:bg-[rgba(40,40,40,0.95)] text-[rgba(18,21,14,0.71)] dark:text-white hover:bg-[rgba(11,110,79,0.1)] hover:shadow-[2px_2px_8px_0px_rgba(0,0,0,0.1)]'
                  }`}
                  style={activeCategory === category ? { backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" } : {}}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px] w-full">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-white dark:bg-[rgba(30,30,30,0.9)] rounded-[24px] overflow-hidden shadow-[4px_4px_2px_0px_rgba(0,0,0,0.05),16px_9px_12px_-1px_rgba(242,242,242,0.86),10px_10px_8px_-2px_rgba(177,211,196,0.3)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-[6px_6px_3px_0px_rgba(0,0,0,0.08),20px_12px_16px_-1px_rgba(242,242,242,0.9),12px_12px_10px_-2px_rgba(177,211,196,0.4)] dark:hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),0_15px_30px_rgba(0,0,0,0.4)]"
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-[rgba(11,110,79,0.9)] via-[rgba(11,110,79,0.5)] to-transparent transition-opacity duration-500 ${
                      hoveredItem === item.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="absolute bottom-0 left-0 right-0 p-[24px] flex flex-col gap-[12px]">
                        <p className="font-['Poppins:Medium',sans-serif] text-white text-[20px] md:text-[24px] leading-[1.2] transition-transform duration-500 translate-y-[10px] group-hover:translate-y-0">
                          {item.title}
                        </p>
                        <div className="flex flex-wrap gap-[8px] transition-transform duration-500 delay-75 translate-y-[10px] group-hover:translate-y-0">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-[12px] py-[4px] bg-white/20 backdrop-blur-sm rounded-[12px] text-white text-[12px] font-['Inter:Regular',sans-serif]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-[20px] md:p-[24px] flex flex-col gap-[8px]">
                    <p className="font-['Poppins:Medium',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-[18px] md:text-[20px] leading-[1.3]">
                      {item.title}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] text-[rgba(11,110,79,1)] text-[14px] md:text-[16px]">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <Link
              to="/portfolio"
              className="relative group px-[32px] py-[16px] text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[16px] md:text-[18px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
              style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
            >
              <span className="flex items-center gap-[8px]">
                View All Projects
                <svg className="w-[20px] h-[20px] transition-transform duration-300 group-hover:translate-x-[4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>

          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-[16px] md:p-[24px] animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] max-w-[900px] w-full max-h-[90vh] flex flex-col shadow-[0_20px_60px_0px_rgba(0,0,0,0.3)] animate-scaleIn overflow-hidden transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-[12px] right-[12px] md:top-[16px] md:right-[16px] z-10 w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-white/90 dark:bg-[rgba(40,40,40,0.9)] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-[rgba(50,50,50,0.95)] hover:scale-110 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)]"
            >
              <svg className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[rgba(18,21,14,0.71)] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Modal Content */}
            <div className="flex flex-col h-full">
              {/* Image */}
              <div className="relative w-full aspect-[3/1] flex-shrink-0 overflow-hidden rounded-t-[24px]">
                <ImageWithFallback
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Details */}
              <div className="p-[20px] md:p-[28px] flex flex-col gap-[12px] md:gap-[16px] flex-1 overflow-y-auto modal-scrollbar">
                {/* Title & Category */}
                <div className="flex flex-col gap-[6px]">
                  <p className="font-['Poppins:Medium',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-[22px] md:text-[28px] leading-[1.2]">
                    {selectedItem.title}
                  </p>
                  <p className="font-['Inter:Medium',sans-serif] text-[rgba(11,110,79,1)] text-[13px] md:text-[15px]">
                    {selectedItem.category}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-[8px]">
                  {selectedItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-[12px] py-[6px] rounded-[12px] text-white text-[12px] md:text-[13px] font-['Inter:Medium',sans-serif] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]"
                      style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <p className="font-['Inter:Regular',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-[13px] md:text-[15px] leading-[1.5]">
                    {selectedItem.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col gap-[12px] mt-[8px]">
                  {/* Primary Buttons Row - View Full Case Study and Discuss Project */}
                  <div className="flex flex-col sm:flex-row gap-[12px]">
                    {/* View Full Case Study Button */}
                    {selectedItem.projectSlug && (
                      <button 
                        onClick={() => {
                          // Navigate to project page
                          window.location.href = `/portfolio/${selectedItem.projectSlug}`;
                        }}
                        className="relative group px-[20px] py-[10px] text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] md:text-[16px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] hover:scale-105 active:scale-95"
                        style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
                      >
                        <span className="flex items-center gap-[8px]">
                          View Full Case Study
                          <svg className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-[4px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </button>
                    )}

                    {/* Discuss Project Button */}
                    <button 
                      onClick={() => {
                        setSelectedItem(null);
                        // Scroll to contact form
                        setTimeout(() => {
                          const contactSection = document.getElementById('contact-section');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                      }}
                      className="relative group px-[20px] py-[10px] bg-white dark:bg-[rgba(40,40,40,0.95)] border-2 border-[rgba(11,110,79,0.9)] text-[rgba(11,110,79,0.9)] dark:text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[13px] md:text-[15px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.05)] transition-all duration-300 hover:bg-[rgba(11,110,79,0.05)] dark:hover:bg-[rgba(11,110,79,0.2)] hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.15)] hover:scale-105 active:scale-95"
                    >
                      <span className="flex items-center gap-[8px]">
                        <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Discuss Project
                      </span>
                    </button>
                  </div>

                  {/* View Live Site Button */}
                  {selectedItem.liveUrl && (
                    <button 
                      onClick={() => {
                        window.open(selectedItem.liveUrl, '_blank', 'noopener,noreferrer');
                      }}
                      className="relative group flex gap-[8px] items-center justify-start py-[10px] md:py-[12px] font-['Inter:Medium',sans-serif] text-[14px] md:text-[16px] text-[rgba(18,21,14,0.71)] dark:text-gray-400 transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 active:opacity-60"
                    >
                      View Live Site
                      <svg className="w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}