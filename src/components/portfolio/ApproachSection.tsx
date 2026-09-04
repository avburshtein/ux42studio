import Link from 'next/link';
import { FloatingElements } from '../FloatingElements';

/**
 * Approach Section — по паттерну Layout2 из исходника главного сайта
 * (HomeDesktop → Layout2 «Human insight meets intelligent tools»):
 * слева тэглайн + градиентный заголовок + текст, справа визуальная панель.
 * Адаптив — как на странице дизайнера: на мобильных визуал сверху (order-1),
 * текст снизу (order-2); на lg — две колонки, текст слева.
 * Стили — токены проекта (Main_page_Spec), кнопка — пилюля primary
 * (h-14 px-8 rounded-full, как HeroSection).
 */
export function ApproachSection() {
  return (
    <section id='approach' className='bg-surface-container-low py-12 md:py-24 lg:py-30'>
      <div className='section-container flex flex-col gap-10 md:gap-16 lg:flex-row lg:items-center lg:gap-20'>
        {/* Визуальная панель — на мобильных сверху */}
        <div className='relative order-1 aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-gradient-to-br from-[rgba(11,110,79,0.08)] to-[rgba(44,90,7,0.12)] lg:order-2 lg:aspect-[600/640] lg:w-auto lg:flex-1'>
          <FloatingElements count={14} minBlur={0} maxBlur={16} />
        </div>

        {/* Текст — на мобильных снизу */}
        <div className='order-2 flex flex-1 flex-col items-start gap-8 lg:order-1'>
          <span className='text-label-md font-semibold uppercase leading-4 tracking-[0.0455em] text-outline-variant'>
            Approach
          </span>

          <h2 className='bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
            Human insight meets intelligent tools
          </h2>

          <p className='max-w-[560px] text-body-lg text-on-surface-variant'>
            We listen first. We understand your business, your customers, and
            what keeps you awake at night. Then we build with precision, using
            AI to accelerate without losing the human touch that makes work
            meaningful.
          </p>

          <Link
            href='#contact'
            className='inline-flex h-14 items-center justify-center whitespace-nowrap rounded-full bg-primary px-8 text-button font-medium text-on-primary shadow-[2px_2px_4px_0_rgba(0,0,0,0.10)] transition-[box-shadow,opacity] duration-150 ease-out hover:opacity-90 hover:shadow-[4px_4px_12px_0_rgba(0,0,0,0.20)]'
          >
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
}
