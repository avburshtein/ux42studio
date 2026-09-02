import { useRef, ReactNode } from 'react';
import Slider from 'react-slick';

interface CardSliderProps {
  children: ReactNode[];
  slidesToShow?: number;
  autoplay?: boolean;
  className?: string;
}

export function CardSlider({ children, slidesToShow = 1, autoplay = false, className = '' }: CardSliderProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: children.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    adaptiveHeight: true, // Adaptive height для правильного отображения
  };

  // Don't render slider if only 1 item
  if (children.length <= 1) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Slider ref={sliderRef} {...settings}>
        {children.map((child, index) => (
          <div key={index} className="h-full">
            {child}
          </div>
        ))}
      </Slider>
    </div>
  );
}