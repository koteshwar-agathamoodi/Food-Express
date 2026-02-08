import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div className={cn('bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden', className)} {...props}>
            {children}
        </div>
    );
}
