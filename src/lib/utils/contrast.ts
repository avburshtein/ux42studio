/**
 * Вычисляет относительную яркость (relative luminance) цвета по WCAG 2.0.
 * Принимает hex-строку (например, "#0066FF" или "#06F").
 */
function relativeLuminance(hex: string): number {
    // Убираем # и поддерживаем краткую запись
    let h = hex.replace('#', '');
    if (h.length === 3) {
        h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    if (h.length !== 6) return 0;

    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;

    // sRGB → линейный RGB
    const linearize = (c: number): number =>
        c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    return (
        0.2126 * linearize(r) +
        0.7152 * linearize(g) +
        0.0722 * linearize(b)
    );
}

/**
 * Вычисляет коэффициент контрастности между двумя цветами по WCAG 2.0.
 * Возвращает число с одним знаком после запятой.
 * L1 — более светлый, L2 — более тёмный.
 * Формула: (L1 + 0.05) / (L2 + 0.05)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
    const l1 = relativeLuminance(hex1);
    const l2 = relativeLuminance(hex2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    const ratio = (lighter + 0.05) / (darker + 0.05);
    return Math.round(ratio * 10) / 10;
}
