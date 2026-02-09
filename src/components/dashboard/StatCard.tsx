import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    trend: string;
    trendUp: boolean;
    color: string;
    delay?: string;
}

const StatCard = ({ label, value, icon: Icon, trend, trendUp, color, delay }: StatCardProps) => {
    return (
        <div className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${delay}`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trend}
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-bold font-heading text-gray-900 mb-1">{value}</h3>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
            </div>
        </div>
    );
};

export default StatCard;
