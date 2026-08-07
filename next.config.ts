import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';
import path from 'path';

// Передаем точный путь к текущему проекту
// Подключаем эмуляцию D1 и .dev.vars для режима локальной разработки (next dev)
initOpenNextCloudflareForDev({
    configPath: path.resolve(process.cwd(), 'wrangler.toml'), // или 'wrangler.toml'
});

const nextConfig: NextConfig = {
    /* config options here */
    // images: {
    //     loader: 'custom',
    //     loaderFile: './image-loader.ts',
    //     deviceSizes: [828, 1920],
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'assets.ux42.studio',
    //             pathname: '/**',
    //         },
    //     ],
    // },
};

export default nextConfig;
