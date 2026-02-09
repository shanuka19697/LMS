import { Plus } from "lucide-react";

interface AdminHeaderProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function AdminHeader({ title, description, actionLabel, onAction }: AdminHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">{description}</p>
            </div>
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                    <Plus size={18} strokeWidth={3} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
