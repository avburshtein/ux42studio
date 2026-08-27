type FilterButtonProps = {
  label?: string;
  selected?: boolean;
  state?: 'Enabled' | 'Hovered' | 'Pressed';
  theme?: 'Light' | 'Dark';
  onClick?: () => void;
  className?: string;
};

export default function FilterButton({
  label = 'Category',
  selected = false,
  state = 'Enabled',
  theme = 'Light',
  onClick,
  className,
}: FilterButtonProps) {

  // ── Background ────────────────────────────────────────────────────
  let bg = '';
  let gradientStyle: React.CSSProperties | undefined;

  if (selected) {
    // Selected — всегда зелёный градиент
    gradientStyle = {
      backgroundImage:
        'linear-gradient(107.879deg, rgba(11, 110, 79, 0.9) 3.7608%, rgba(44, 90, 7, 0.9) 98.529%)',
    };
  } else if (theme === 'Dark') {
    // Unselected Dark
    bg = 'bg-[rgba(40,40,40,0.95)]';
  } else {
    // Unselected Light
    bg = state === 'Hovered' ? 'bg-[rgba(11,110,79,0.10)]' : 'bg-white';
  }

  // ── Shadow ────────────────────────────────────────────────────────
  let shadow = '';

  if (selected) {
    shadow =
      state === 'Hovered'
        ? 'shadow-[4px_4px_12px_0px_rgba(11,110,79,0.20)]'
        : 'shadow-[2px_2px_4px_0px_rgba(0,0,0,0.10)]';
  } else if (state === 'Hovered') {
    shadow = 'shadow-[2px_2px_8px_0px_rgba(0,0,0,0.10)]';
  }

  // ── Scale ─────────────────────────────────────────────────────────
  const scale =
    state === 'Hovered' ? 'scale-105' : state === 'Pressed' ? 'scale-95' : 'scale-100';

  // ── Text color ────────────────────────────────────────────────────
  const textColor =
    selected || theme === 'Dark'
      ? 'text-white'
      : 'text-[rgba(18,21,14,0.71)]';

  return (
    <button
      onClick={onClick}
      className={
        className ??
        [
          'flex items-center justify-center',
          'px-[24px] py-[12px]',
          'rounded-[48px]',
          'cursor-pointer',
          'transition-all duration-300',
          bg,
          shadow,
          scale,
        ]
          .filter(Boolean)
          .join(' ')
      }
      style={gradientStyle}
    >
      <p
        className={[
          'font-[\'Inter:Medium\',sans-serif]',
          'font-medium',
          'text-[14px]',
          'leading-[1.5]',
          'not-italic',
          'whitespace-nowrap',
          'tracking-[0.5px]',
          textColor,
        ].join(' ')}
      >
        {label}
      </p>
    </button>
  );
}
