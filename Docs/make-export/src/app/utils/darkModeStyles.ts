/**
 * Utility function to add dark mode text color classes
 */
export function addDarkTextClass(className: string): string {
  // If className contains text-[#070309], add dark:text-white
  if (className.includes('text-[#070309]')) {
    return className.replace('text-[#070309]', 'text-[#070309] dark:text-white transition-colors duration-300');
  }
  
  // If className contains text-[rgba(18,21,14,0.71)], add dark:text-white/85
  if (className.includes('text-[rgba(18,21,14,0.71)]')) {
    return className.replace('text-[rgba(18,21,14,0.71)]', 'text-[rgba(18,21,14,0.71)] dark:text-white/85 transition-colors duration-300');
  }
  
  // If className contains text-[rgba(18,21,14,0.5)], add dark:text-white/70
  if (className.includes('text-[rgba(18,21,14,0.5)]')) {
    return className.replace('text-[rgba(18,21,14,0.5)]', 'text-[rgba(18,21,14,0.5)] dark:text-white/70 transition-colors duration-300');
  }
  
  return className;
}
