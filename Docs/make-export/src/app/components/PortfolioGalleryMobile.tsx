import { useState, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Slider from 'react-slick';
import { ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router';

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

const categories = ['All', 'Web Design', 'App Design', 'Branding', 'Graphic Design', 'Packaging'];

export function PortfolioGalleryMobile() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sliderRef = useRef<Slider>(null);

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: false, // Фиксированная высота
  };

  return (
    <div className="bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(20,20,20,0.95)] backdrop-blur-md relative shadow-[8px_8px_20px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_20px_0px_rgba(255,255,255,0.05)] shrink-0 w-full transition-colors duration-300">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center px-[20px] py-[60px] relative w-full">
          <div className="content-stretch flex flex-col gap-[40px] items-center max-w-[1280px] relative shrink-0 w-full">
            
            {/* Section Title */}
            <div className="content-stretch flex flex-col gap-[16px] items-center not-italic relative shrink-0 text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-center w-full whitespace-pre-wrap">
              <p className="font-['Poppins:Medium',sans-serif] leading-[1.2] relative shrink-0 text-[28px] tracking-[-0.28px] w-full">Our Portfolio</p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.5] relative shrink-0 text-[14px] w-full mb-0">
                Explore our best work in web design, branding, and digital products
              </p>
            </div>

            {/* Category Filter - Collapsible with Filter Icon */}
            <div className="w-full px-[16px]">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-[20px] py-[14px] rounded-[24px] bg-white dark:bg-[rgba(40,40,40,0.95)] border-2 border-[#0b6e4f]/20 dark:border-white/10 transition-all duration-300 hover:border-[#0b6e4f]/40 dark:hover:border-white/20"
              >
                <span className="font-['Inter:Medium',sans-serif] text-[14px] text-[rgba(18,21,14,0.71)] dark:text-white flex items-center gap-[8px]">
                  <Filter className="w-[18px] h-[18px]" />
                  {activeCategory === 'All' ? 'All Projects' : activeCategory}
                </span>
                <ChevronRight 
                  className={`w-[20px] h-[20px] text-[rgba(18,21,14,0.71)] dark:text-white transition-transform duration-300 ${isFilterOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Filter Options - Collapsible */}
              <div 
                className={`grid grid-cols-2 gap-[12px] mt-[12px] transition-all duration-300 overflow-hidden ${
                  isFilterOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      setIsFilterOpen(false);
                    }}
                    className={`px-[16px] py-[10px] rounded-[48px] font-['Inter:Medium',sans-serif] text-[13px] transition-all duration-300 ${
                      activeCategory === category
                        ? 'text-white shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]'
                        : 'bg-white dark:bg-[rgba(40,40,40,0.95)] text-[rgba(18,21,14,0.71)] dark:text-white border-2 border-[#0b6e4f]/20 dark:border-white/10'
                    }`}
                    style={activeCategory === category ? {
                      backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)"
                    } : {}}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Portfolio Slider */}
            <div className="relative w-full">
              <Slider ref={sliderRef} {...sliderSettings}>
                {filteredItems.map((item) => (
                  <div key={item.id} className="px-[8px] h-full">
                    <div
                      onClick={() => setSelectedItem(item)}
                      className="bg-white dark:bg-[rgba(30,30,30,0.9)] rounded-[24px] overflow-hidden shadow-[4px_4px_2px_0px_rgba(0,0,0,0.05),16px_9px_12px_-1px_rgba(242,242,242,0.86),10px_10px_8px_-2px_rgba(177,211,196,0.3)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-500 active:scale-[0.98] h-full flex flex-col mx-auto w-full max-w-[400px]"
                    >
                      {/* Image - Увеличенный размер */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Card Content - Больше padding */}
                      <div className="p-[24px] flex flex-col gap-[14px] flex-grow">
                        <p className="font-['Poppins:Medium',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-[20px] leading-[1.3]">
                          {item.title}
                        </p>
                        <p className="font-['Inter:Regular',sans-serif] text-[rgba(11,110,79,1)] text-[15px]">
                          {item.category}
                        </p>
                        <div className="flex flex-wrap gap-[8px]">
                          {item.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-[12px] py-[5px] bg-[rgba(11,110,79,0.1)] dark:bg-[rgba(255,255,255,0.1)] rounded-[12px] text-[rgba(11,110,79,1)] dark:text-white text-[13px] font-['Inter:Regular',sans-serif]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* View All Button */}
            <Link
              to="/portfolio"
              className="relative group px-[28px] py-[14px] text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[4px_4px_12px_0px_rgba(11,110,79,0.2)] active:scale-95"
              style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
            >
              View All Projects
            </Link>

          </div>
        </div>
      </div>

      {/* Modal - Same as desktop version */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-[16px] animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative bg-white dark:bg-[rgba(30,30,30,0.95)] rounded-[24px] max-w-[900px] w-full max-h-[90vh] flex flex-col shadow-[0_20px_60px_0px_rgba(0,0,0,0.3)] animate-scaleIn overflow-hidden transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-[12px] right-[12px] z-10 w-[36px] h-[36px] rounded-full bg-white/90 dark:bg-[rgba(40,40,40,0.9)] backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-[rgba(50,50,50,0.95)] hover:scale-110 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.2)]"
            >
              <svg className="w-[20px] h-[20px] text-[rgba(18,21,14,0.71)] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Modal Content */}
            <div className="flex flex-col h-full">
              {/* Image */}
              <div className="relative w-full aspect-[16/9] flex-shrink-0 overflow-hidden rounded-t-[24px]">
                <ImageWithFallback
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Details */}
              <div className="p-[20px] flex flex-col gap-[12px] flex-1 overflow-y-auto">
                {/* Title & Category */}
                <div className="flex flex-col gap-[6px]">
                  <p className="font-['Poppins:Medium',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-[20px] leading-[1.2]">
                    {selectedItem.title}
                  </p>
                  <p className="font-['Inter:Medium',sans-serif] text-[rgba(11,110,79,1)] text-[13px]">
                    {selectedItem.category}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-[8px]">
                  {selectedItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-[12px] py-[6px] rounded-[12px] text-white text-[12px] font-['Inter:Medium',sans-serif] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)]"
                      style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <p className="font-['Inter:Regular',sans-serif] text-[rgba(18,21,14,0.71)] dark:text-gray-400 text-[13px] leading-[1.5]">
                    {selectedItem.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col gap-[12px] mt-[8px]">
                  {selectedItem.projectSlug && (
                    <button 
                      onClick={() => {
                        window.location.href = `/portfolio/${selectedItem.projectSlug}`;
                      }}
                      className="w-full px-[20px] py-[12px] text-white rounded-[48px] font-['Inter:Medium',sans-serif] text-[14px] shadow-[2px_2px_4px_0px_rgba(0,0,0,0.1)] transition-all duration-300 active:scale-95"
                      style={{ backgroundImage: "linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)" }}
                    >
                      View Full Case Study
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