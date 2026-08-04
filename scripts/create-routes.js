const fs = require('fs');
const path = require('path');

// Структура роутов и содержимого файлов
const routes = {
    // --- PUBLIC ---
    'app/(public)/page.tsx': `export default function HomePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Главная страница</h1>
      <p className="mt-2 text-gray-600">Список дизайнеров и избранных проектов</p>
    </main>
  );
}
`,
    'app/(public)/u/[user-slug]/page.tsx': `export default function ProfilePage({ params }: { params: { 'user-slug': string } }) {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Профиль дизайнера: {params['user-slug']}</h1>
    </main>
  );
}
`,
    'app/(public)/u/[user-slug]/[project-slug]/page.tsx': `export default function ProjectPage({
  params,
}: {
  params: { 'user-slug': string; 'project-slug': string };
}) {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Проект: {params['project-slug']}</h1>
      <p className="mt-2 text-gray-600">Автор: {params['user-slug']}</p>
    </main>
  );
}
`,

    // --- AUTH ---
    'app/(auth)/login/page.tsx': `export default function LoginPage() {
  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Вход в систему</h1>
    </main>
  );
}
`,
    'app/(auth)/register/page.tsx': `export default function RegisterPage() {
  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Регистрация по инвайту</h1>
    </main>
  );
}
`,

    // --- USER ADMIN ---
    'app/admin/page.tsx': `export default function AdminDashboardPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Панель управления дизайнера</h1>
      <p className="mt-2 text-gray-600">Список моих проектов</p>
    </main>
  );
}
`,
    'app/admin/projects/new/page.tsx': `export default function CreateProjectPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Создание нового проекта</h1>
    </main>
  );
}
`,
    'app/admin/projects/[id]/edit/page.tsx': `export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Редактирование проекта #{params.id}</h1>
    </main>
  );
}
`,
    'app/admin/profile/page.tsx': `export default function EditProfilePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Настройки профиля</h1>
    </main>
  );
}
`,

    // --- SUPER ADMIN (Protected via Zero Trust) ---
    'app/super-admin/page.tsx': `export default function SuperAdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Суперадминка</h1>
      <p className="mt-2 text-gray-600">Обзорная статистика платформы</p>
    </main>
  );
}
`,
    'app/super-admin/users/page.tsx': `export default function SuperAdminUsersPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Управление пользователями</h1>
    </main>
  );
}
`,
    'app/super-admin/invites/page.tsx': `export default function SuperAdminInvitesPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Генерация и менеджмент инвайтов</h1>
    </main>
  );
}
`,
    'app/super-admin/projects/page.tsx': `export default function SuperAdminProjectsPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Модерация всех проектов</h1>
    </main>
  );
}
`,

    // --- API ROUTES ---
    'app/api/upload/route.ts': `import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Upload endpoint placeholder' });
}
`,
    'app/api/health/route.ts': `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', timestamp: Date.now() });
}
`,
};

function createDirectoryAndFile(filePath, content) {
    const absolutePath = path.join(process.cwd(), filePath);
    const dirPath = path.dirname(absolutePath);

    // Создаем директорию, если её нет
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Записываем файл (если его еще нет, чтобы не перезаписать готовый код)
    if (!fs.existsSync(absolutePath)) {
        fs.writeFileSync(absolutePath, content, 'utf8');
        console.log(`+ Создан файл: ${filePath}`);
    } else {
        console.log(`= Пропущен (уже существует): ${filePath}`);
    }
}

console.log('🚀 Создание структуры роутинга...');
Object.entries(routes).forEach(([filePath, content]) => {
    createDirectoryAndFile(filePath, content);
});
console.log('✨ Готово!');
