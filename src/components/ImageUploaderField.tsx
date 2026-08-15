'use client';

import { useState } from 'react';
import ImageUploader from './ImageUploader';

type UploadedFile = { fileId: string; r2Key: string };

type ImageUploaderFieldProps = {
    value?: string | null;
    onChange: (fileId: string | null) => void;
    accept?: string;
    maxSize?: number;
    aspectRatio?: number;
};

export default function ImageUploaderField({
    onChange,
    accept,
    maxSize,
    aspectRatio,
}: ImageUploaderFieldProps) {
    const [uploaded, setUploaded] = useState<UploadedFile | null>(null);

    // Only show a preview when we have a real r2Key (from a fresh upload).
    // A bare fileId (loaded from DB) has no r2Key, so we render the empty
    // dropzone instead of a broken image.
    const activeValue: UploadedFile | null = uploaded ?? null;

    return (
        <ImageUploader
            value={activeValue}
            onChange={(file) => {
                setUploaded(file);
                onChange(file?.fileId ?? null);
            }}
            accept={accept}
            maxSize={maxSize}
            aspectRatio={aspectRatio}
        />
    );
}
