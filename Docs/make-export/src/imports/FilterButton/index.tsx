type FilterButtonProps = {
  className?: string;
  label?: string;
  selected?: boolean;
  state?: "Enabled" | "Hovered" | "Pressed";
  theme?: "Light" | "Dark";
};

export default function FilterButton({ className, label = "Category", selected = false, state = "Enabled", theme = "Light" }: FilterButtonProps) {
  const isNotSelectedAndEnabledAndDark = !selected && state === "Enabled" && theme === "Dark";
  const isSelectedAndLight = selected && theme === "Light";
  return (
    <div className={className || `content-stretch flex items-center justify-center px-[24px] py-[12px] relative rounded-[48px] ${selected && state === "Hovered" && theme === "Light" ? "drop-shadow-[4px_4px_6px_rgba(11,110,79,0.2)]" : selected && theme === "Light" && ["Enabled", "Pressed"].includes(state) ? "drop-shadow-[2px_2px_2px_rgba(0,0,0,0.1)]" : !selected && state === "Hovered" ? "bg-[#0b6e4f] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.15)]" : isNotSelectedAndEnabledAndDark ? "bg-[#0b6e4f]" : "bg-white"}`} style={isSelectedAndLight ? { backgroundImage: "linear-gradient(50.7928deg, rgba(11, 110, 79, 0.9) 15.683%, rgba(44, 90, 7, 0.9) 90.897%)" } : undefined}>
      {(isNotSelectedAndEnabledAndDark || (!selected && state === "Hovered" && theme === "Dark") || isSelectedAndLight) && <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-white tracking-[0.5px] whitespace-nowrap">{label}</p>}
      {!selected && theme === "Light" && <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#44474b] text-[13px] tracking-[0.5px] whitespace-nowrap">{label}</p>}
    </div>
  );
}