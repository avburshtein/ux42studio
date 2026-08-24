import os
target = r'd:\Хранилище\Projects\ux42studio\src\app\(public)\u\[slug]\page.tsx'
os.makedirs(os.path.dirname(target), exist_ok=True)

with open(target, 'w', encoding='utf-8') as f:
    f.write('''import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb } from '@/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/case/SiteHeader';
import { SiteFooter } from '@/components/case/SiteFooter';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { PortfolioGallerySection } from '@/components/portfolio/PortfolioGallerySection';
import { PortfolioCard } from '@/components/PortfolioCard';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { CtaSection } from '@/components/portfolio/CtaSection';
import { FAB } from '@/components/FAB';

export const revalidate = 3600;

interface PageProps { params: Promise<{ slug: string }>; }

function getImageUrl(r2Key: string): string { return `/r2/''' + '${r2Key}`; }

''')
print('part1 ok')