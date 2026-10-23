import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';

export default defineCloudflareConfig({
    // R2 incremental cache — хранилище для SSG/ISR-страниц. Без него OpenNext
    // использует dummy-cache и рендерит ВСЕ страницы (включая статические
    // /privacy, /terms, /help и ISR-страницы с revalidate) через Next-сервер
    // на каждый запрос — лишний CPU на воркере.
    // Биндинг NEXT_INC_CACHE_R2_BUCKET указывает на bucket ux42-assets
    // (wrangler.toml): кеш OpenNext живёт в собственном префиксе, данных
    // сайта не затрагивает.
    incrementalCache: r2IncrementalCache,
    // Очередь revalidation на Durable Object: дедупликация time-based
    // revalidation (revalidate=300 на / и /platform), чтобы одна просроченная
    // страница не пересобиралась параллельно каждым запросом.
    // Требует DO-биндинг NEXT_CACHE_DO_QUEUE (класс DOQueueHandler) в
    // wrangler.toml — см. Docs/DEPLOY.md, раздел «Кеш ISR/SSG».
    queue: doQueue,
});
