'use client';

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import PageTitle from '@/components/ui/PageTitle';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import AccountNameForm from '@/components/admin/AccountNameForm';
import PublicationToggle from '@/components/admin/PublicationToggle';
import DeleteAccountSection from '@/components/admin/DeleteAccountSection';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';
import {
    getMyAccountEmail,
    getMyPublicationStatus,
} from '@/lib/actions/profile';

// Разделы настроек. Порядок = от «кто я» к необратимым действиям.
const SECTIONS = [
    { id: 'account', label: 'Аккаунт' },
    { id: 'security', label: 'Безопасность' },
    { id: 'danger', label: 'Удаление профиля' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

/**
 * Настройки пользователя: личная информация, безопасность и опасная зона
 * в одном месте.
 *
 * Раньше это было размазано по трём экранам — личные поля в /admin/profile,
 * пароль по ссылке внутри формы, удаление аккаунта отдельным пунктом
 * сайдбара. Пользователю приходилось держать в голове, где что лежит.
 *
 * Разметка сайдбара повторяет /admin/profile (слева список разделов,
 * справа содержимое) — два экрана выглядят одинаково, переход предсказуем.
 */
export default function SettingsPage() {
    const [section, setSection] = useState<SectionId>('account');
    const [accountEmail, setAccountEmail] = useState('');
    const [publication, setPublication] = useState<{
        profileId: string | null;
        isPublic: boolean;
    }>({ profileId: null, isPublic: true });

    useEffect(() => {
        getMyAccountEmail()
            .then((mail) => setAccountEmail(mail ?? ''))
            .catch(() => setAccountEmail(''));
        getMyPublicationStatus()
            .then(setPublication)
            .catch(() => setPublication({ profileId: null, isPublic: true }));
    }, []);

    return (
        <main className=''>
            {/* Шапка страницы. Отступ снизу `mb-10` (40px) — раньше шапка и
                первый раздел стояли встык, без зазора. */}
            <header className='mb-10'>
                <PageTitle className='mb-2'>Настройки профиля</PageTitle>
                <p className='text-body-sm text-on-surface-variant'>
                    Личные данные, доступ и управление аккаунтом
                </p>
            </header>

            <div className='flex flex-col gap-8 md:flex-row'>
                <aside className='w-full shrink-0 md:w-64'>
                    <nav className='md:sticky md:top-8'>
                        <ul className='flex gap-1 overflow-x-auto pb-2 md:flex-col md:space-y-1 md:overflow-visible md:pb-0'>
                            {SECTIONS.map((s) => (
                                <li
                                    key={s.id}
                                    className='shrink-0 md:shrink'
                                >
                                    <button
                                        type='button'
                                        onClick={() => setSection(s.id)}
                                        aria-current={
                                            section === s.id
                                                ? 'page'
                                                : undefined
                                        }
                                        className={`block w-full cursor-pointer whitespace-nowrap rounded-md px-3 py-2 text-left text-body-sm transition-colors ${
                                            section === s.id
                                                ? 'bg-primary-container text-on-primary-container font-medium'
                                                : 'text-on-surface-variant hover:bg-surface-variant/50'
                                        }`}
                                    >
                                        {s.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>

                <div className='min-w-0 flex-1 space-y-6'>
                    {section === 'account' && (
                        <>
                            {/* Email — идентификатор входа, менять его нельзя.
                                Показываем здесь же, чтобы не искать в
                                другом разделе. */}
                            <Card className='p-6'>
                                <h2 className='text-title-md text-on-surface'>
                                    Вход в аккаунт
                                </h2>
                                <p className='mt-1 text-body-sm text-on-surface-variant'>
                                    Этот email используется для входа и для
                                    системных писем платформы.
                                </p>
                                <div className='mt-6 max-w-sm'>
                                    <Label htmlFor='account-email'>
                                        Email
                                    </Label>
                                    <div className='flex items-center gap-2'>
                                        <Input
                                            id='account-email'
                                            type='email'
                                            readOnly
                                            value={accountEmail}
                                            className='text-on-surface-variant'
                                        />
                                        <Lock
                                            className='h-4 w-4 shrink-0 text-on-surface-variant'
                                            aria-hidden='true'
                                        />
                                    </div>
                                    <p className='mt-1 min-h-[1.5rem] text-body-sm text-on-surface-variant'>
                                        Email нельзя изменить в панели — он
                                        привязан к учётной записи.
                                    </p>
                                </div>
                            </Card>

                            <AccountNameForm />

                            {/* «Скрыть сайт» — здесь, рядом с удалением:
                                обе настройки управляют доступностью
                                страницы, а не её содержимым. */}
                            {publication.profileId && (
                                <PublicationToggle
                                    profileId={publication.profileId}
                                    initialIsPublic={publication.isPublic}
                                />
                            )}
                        </>
                    )}

                    {section === 'security' && (
                        <Card className='p-6'>
                            <h2 className='text-title-md text-on-surface'>
                                Пароль
                            </h2>
                            <p className='mt-1 text-body-sm text-on-surface-variant'>
                                При регистрации пароль сгенерировала система —
                                вы видели его один раз на экране. Замените
                                его своим: так его проще запомнить и
                                сложнее подобрать. Сессия хранится 7 дней,
                                после чего нужно войти заново.
                            </p>
                            <div className='mt-6 max-w-sm'>
                                <ChangePasswordForm />
                            </div>
                        </Card>
                    )}

                    {section === 'danger' &&
                        (accountEmail ? (
                            /* Оформление как «Danger Zone» в GitHub: рамка
                               контейнера в цвете ошибки + кнопка в error.
                               Класс `border-error` перебивает дефолтную
                               рамку Card через twMerge (cn). */
                            <Card className='border-error p-6'>
                                <DeleteAccountSection
                                    accountEmail={accountEmail}
                                />
                            </Card>
                        ) : (
                            <p className='text-body-sm text-on-surface-variant'>
                                Загрузка…
                            </p>
                        ))}
                </div>
            </div>
        </main>
    );
}
