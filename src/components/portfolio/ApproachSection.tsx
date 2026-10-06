import ContactDialog from '../ContactDialog';
import { SectionLabel } from './SectionLabel';

/**
 * Approach Section — «Human insight meets intelligent tools».
 *
 * Решение (70), 2026-09-26 — блок переведён на типографику, фото
 * `/approach-1.webp` удалено. Причина: сгенерированное изображение читалось
 * как ИИ-сток (светящийся wireframe-мозг, голографические панели) и спорило
 * с собственным текстом секции — подпись говорит про человеческую
 * проницательность, а картинка показывала машинную эстетику без человека.
 *
 * Чем заменено: тот же визуальный ритм (слева заголовок + текст + кнопка,
 * справа колонка), но правая колонка — не фото, а три принципа работы.
 * Смысл «инструментов» несут тонкие линии-разделители; технологичность
 * возникает из фонового боке, которое ставит родитель (page.tsx).
 *
 * Решение (72): фон и `overflow-hidden` перенесены на обёртку в page.tsx,
 * где секция живёт вместе с Studio. Боке должно идти от NavLabel Approach
 * до NavLabel Studio — то есть через две секции, и внутри одной оно
 * обрезалось бы. Здесь секция прозрачная, `relative z-10` — контент всегда
 * над слоем боке.
 *
 * Токены и сетка — прежние (Main_page_Spec §4/§7), чтобы блок остался
 * частью главной, а не выглядел отдельной страницей.
 */

const PRINCIPLES = [
    {
        title: 'Listen first',
        body: 'Your business, your customers, what keeps you awake at night — we understand all of it before opening a single design file.',
    },
    {
        title: 'Build with precision',
        body: 'We use AI to accelerate the parts that should be fast, and never let it flatten the thinking behind them.',
    },
    {
        title: 'Keep it human',
        body: 'Work stays meaningful when a person can still feel the person who made it. That never goes through an API.',
    },
];

export function ApproachSection() {
  return (
    <section
      id='approach'
      className='relative z-10 scroll-mt-20 py-12 md:py-24 lg:py-30'
    >
      <div className='section-container flex flex-col gap-16'>
        <SectionLabel label='Approach' />

        <div className='flex flex-col gap-12 md:gap-16 lg:flex-row lg:items-start lg:gap-20'>
          {/* Заголовок, текст и кнопка — как раньше в левой колонке */}
          <div className='flex flex-1 flex-col items-start gap-8'>
            <h2 className='bg-gradient-to-br from-primary to-[#2C5A07] bg-clip-text font-display text-[32px] font-medium leading-[1.2] tracking-[-0.5px] text-transparent lg:text-[52px] lg:leading-[1.2]'>
              Human insight meets intelligent tools
            </h2>

            <p className='max-w-[560px] text-body-lg text-on-surface-variant'>
              We listen first. We understand your business, your customers, and
              what keeps you awake at night. Then we build with precision, using
              AI to accelerate without losing the human touch that makes work
              meaningful.
            </p>

            {/* Форма вместо скролла к #contact: диалог открывается сразу. */}
            <ContactDialog label='Start a project' source='Home' />
          </div>

          {/* Три принципа — тонкие разделители занимают место фотографии */}
          <ul className='flex flex-1 flex-col gap-8 lg:max-w-[400px]'>
            {PRINCIPLES.map((principle, i) => (
              <li key={principle.title} className='flex flex-col gap-2'>
                <div className='flex items-center gap-4'>
                  <span className='font-display text-title-md font-medium tabular-nums text-primary'>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden className='h-px flex-1 bg-outline-variant' />
                </div>
                <h3 className='font-display text-title-lg font-medium text-on-surface'>
                  {principle.title}
                </h3>
                <p className='text-body-md text-on-surface-variant'>
                  {principle.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
