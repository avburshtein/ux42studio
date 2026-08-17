interface MetadataCardProps {
    label: string;
    value: string;
}

// Карточка метаданных в hero: CLIENT / TIMELINE / MY ROLE / DEVICES
export function MetadataCard({ label, value }: MetadataCardProps) {
    return (
        <div className='flex min-w-0 flex-col gap-2 rounded-base bg-surface-container-lowest p-6'>
            <span className='text-label-md uppercase text-primary'>
                {label}
            </span>
            <span className='text-body-md break-words text-on-surface'>
                {value}
            </span>
        </div>
    );
}
