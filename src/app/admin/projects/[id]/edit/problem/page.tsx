'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import WizardSaveBar, {
    useSavedFlag,
} from '@/components/admin/WizardSaveBar';
import { Label } from '@/components/ui/Label';
import Title from '@/components/ui/Title';
import {
    updateProjectProblem,
    getProjectProblem,
} from '@/lib/actions/projects';
import SubsectionsEditor from '@/components/admin/SubsectionsEditor';

const formSchema = z.object({
    problemStatement: z.string().optional().or(z.literal('')),
    projectGoal: z.string().optional().or(z.literal('')),
    targetUsers: z.string().optional().or(z.literal('')),
    // Кастомный заголовок секции на кейс-странице (D-009)
    problemTitle: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function ProblemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    const [projectId, setProjectId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [saved, markSaved] = useSavedFlag();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        params.then((p) => setProjectId(p.id));
    }, [params]);

    const { register, handleSubmit, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            problemStatement: '',
            projectGoal: '',
            targetUsers: '',
            problemTitle: '',
        },
    });

    useEffect(() => {
        if (!projectId) return;
        getProjectProblem(projectId)
            .then((p) => {
                reset({
                    problemStatement: p?.problemStatement ?? '',
                    projectGoal: p?.projectGoal ?? '',
                    targetUsers: p?.targetUsers ?? '',
                    problemTitle: p?.problemTitle ?? '',
                    // keepDirtyValues: не затирать поля, которые пользователь
                    // уже начал править до загрузки (фикс «прыжка» курсора
                    // при выделении — фидбэк 2026-10-30)
                }, { keepDirtyValues: true });
            })
            .catch(() => {});
    }, [projectId, reset]);

    const submitData = async (data: FormData): Promise<boolean> => {
        if (!projectId) return false;
        setSaving(true);
        setError(null);
        try {
            await updateProjectProblem(projectId, {
                problemStatement: data.problemStatement || undefined,
                projectGoal: data.projectGoal || undefined,
                targetUsers: data.targetUsers || undefined,
                problemTitle: data.problemTitle || undefined,
            });
            return true;
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Save failed');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        if (await submitData(data)) {
            router.push(`/admin/projects/${projectId}/edit/research`);
        }
    };

    const onSaveOnly = async (data: FormData) => {
        if (await submitData(data)) {
            markSaved();
        }
    };

    return (
        <div>
            <Title className='mb-6' tag='h1'>
                Problem & Audience
            </Title>
            <p className='mb-4 text-body-sm text-on-surface-variant'>
                Форматирование: переносы строк сохраняются, строка с «- » —
                элемент списка с зелёным маркером, **жирный**, *курсив*.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                {/* Кастомный заголовок секции (D-009): пусто → дефолт «The challenge» */}
                <div>
                    <Label htmlFor='problemTitle'>
                        Заголовок секции (необязательно)
                    </Label>
                    <input
                        id='problemTitle'
                        {...register('problemTitle')}
                        placeholder='The challenge'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                    />
                </div>

                <div>
                    <Label htmlFor='problemStatement'>Problem Statement</Label>
                    <textarea
                        id='problemStatement'
                        {...register('problemStatement')}
                        placeholder='Describe the problem this project aims to solve…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={5}
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Формат: перенос строки — новый абзац, [текст](ссылка)
                        — ссылка, **жирный**, *курсив*, - элемент списка.
                    </p>
                </div>

                <div>
                    <Label htmlFor='projectGoal'>Project Goal</Label>
                    <textarea
                        id='projectGoal'
                        {...register('projectGoal')}
                        placeholder='What is the main goal of this project?'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={5}
                    />
                </div>

                <div>
                    <Label htmlFor='targetUsers'>Target Users</Label>
                    <textarea
                        id='targetUsers'
                        {...register('targetUsers')}
                        placeholder='Who are the target users? Describe their needs and context…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={5}
                    />
                </div>

                {/* D-011: подразделы внутри секции Problem & Audience */}
                {projectId && (
                    <div className='mt-12'>
                        <SubsectionsEditor
                            projectId={projectId}
                            sectionKeys={[
                                {
                                    key: 'problem',
                                    label: 'Problem & Audience',
                                },
                            ]}
                        />
                    </div>
                )}

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='sticky bottom-0 z-30 -mx-4 flex items-center justify-between gap-3 border-t border-outline-variant bg-surface/95 px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/general`,
                            )
                        }
                    >
                        ← Back
                    </Button>
                    <WizardSaveBar
                        saving={saving}
                        saved={saved}
                        onSave={handleSubmit(onSaveOnly)}
                    />
                </div>
            </form>
        </div>
    );
}
