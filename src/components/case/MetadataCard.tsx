interface MetadataCardProps {
    label: string;
    value: string;
}

// Карточка метаданных в hero: CLIENT / TIMELINE / MY ROLE / DEVICES
export function MetadataCard({ label, value }: MetadataCardProps) {
    return (
        <div className='flex w-full flex-col items-start gap-2 rounded-base p-4 sm:p-6'>
            <span className='text-label-md uppercase text-primary'>
                {label}
            </span>
            <span className='text-body-sm break-words text-on-surface'>
                {value}
            </span>
        </div>
    );
}
