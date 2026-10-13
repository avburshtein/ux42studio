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
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Title from '@/components/ui/Title';
import ColorRolePicker from '@/components/ColorRolePicker';
import { updateProjectDesign, getProjectDesign } from '@/lib/actions/projects';

const formSchema = z.object({
    visualDirection: z.string().optional().or(z.literal('')),
    displayFont: z.string().optional().or(z.literal('')),
    displayFontSpec: z.string().optional().or(z.literal('')),
    bodyFont: z.string().optional().or(z.literal('')),
    bodyFontSpec: z.string().optional().or(z.literal('')),
    designApproach: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function DesignPage({
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

    const { register, handleSubmit, setValue } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            visualDirection: '',
            displayFont: '',
            displayFontSpec: '',
            bodyFont: '',
            bodyFontSpec: '',
            designApproach: '',
        },
    });

    useEffect(() => {
        if (!projectId) return;
        getProjectDesign(projectId)
            .then((d) => {
                setValue('visualDirection', d?.visualDirection ?? '');
                setValue('displayFont', d?.displayFont ?? '');
                setValue('displayFontSpec', d?.displayFontSpec ?? '');
                setValue('bodyFont', d?.bodyFont ?? '');
                setValue('bodyFontSpec', d?.bodyFontSpec ?? '');
                setValue('designApproach', d?.designApproach ?? '');
            })
            .catch(() => {});
    }, [projectId, setValue]);

    const submitData = async (data: FormData): Promise<boolean> => {
        if (!projectId) return false;
        setSaving(true);
        setError(null);
        try {
            await updateProjectDesign(projectId, {
                visualDirection: data.visualDirection || undefined,
                displayFont: data.displayFont || undefined,
                displayFontSpec: data.displayFontSpec || undefined,
                bodyFont: data.bodyFont || undefined,
                bodyFontSpec: data.bodyFontSpec || undefined,
                designApproach: data.designApproach || undefined,
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
            router.push(`/admin/projects/${projectId}/edit/gallery`);
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
                Design
            </Title>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div>
                    <Label htmlFor='visualDirection'>Visual Direction</Label>
                    <textarea
                        id='visualDirection'
                        {...register('visualDirection')}
                        placeholder={'Describe the visual style, mood, and aesthetic direction…\n- Calm and trustworthy\n- Rounded shapes, soft shadows'}
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Переносы сохраняются; «- » — список с зелёным маркером;
                        **жирный**, *курсив*.
                    </p>
                </div>

                <div>
                    <Label htmlFor='displayFont'>Display Font</Label>
                    <Input
                        id='displayFont'
                        {...register('displayFont')}
                        placeholder='Inter'
                    />
                </div>

                <div>
                    <Label htmlFor='displayFontSpec'>
                        Display Font — характеристики
                    </Label>
                    <Input
                        id='displayFontSpec'
                        {...register('displayFontSpec')}
                        placeholder='Например: Bold 64/72, Black для заголовков, Italic для акцентов'
                    />
                    <p className='mt-1 text-body-sm text-on-surface-variant'>
                        Необязательно: вес, размеры, начертания — если не
                        следуете стандартам Material.
                    </p>
                </div>

                <div>
                    <Label htmlFor='bodyFont'>Body Font</Label>
                    <Input
                        id='bodyFont'
                        {...register('bodyFont')}
                        placeholder='Roboto'
                    />
                </div>

                <div>
                    <Label htmlFor='bodyFontSpec'>
                        Body Font — характеристики
                    </Label>
                    <Input
                        id='bodyFontSpec'
                        {...register('bodyFontSpec')}
                        placeholder='Например: Regular 16/24, Medium для выделений'
                    />
                </div>

                <div>
                    <Label htmlFor='designApproach'>Design Approach</Label>
                    <textarea
                        id='designApproach'
                        {...register('designApproach')}
                        placeholder='Explain the design methodology, principles, and key decisions…'
                        className='w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-body-sm text-on-surface focus:border-transparent focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]'
                        rows={4}
                    />
                </div>

                <div className='mt-12'>
                    <Title variant='headline-md'>Color Roles</Title>
                    {projectId ? (
                        <ColorRolePicker projectId={projectId} />
                    ) : (
                        <p className='text-body-sm text-on-surface-variant'>
                            Загрузка...
                        </p>
                    )}
                </div>

                {error && <p className='text-body-sm text-error'>{error}</p>}

                <div className='flex justify-between gap-3 pt-4 mt-6'>
                    <Button
                        type='button'
                        variant='ghost'
                        onClick={() =>
                            router.push(
                                `/admin/projects/${projectId}/edit/research`,
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
