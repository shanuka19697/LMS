interface AdminTableProps {
    headers: string[];
    children: React.ReactNode;
}

export function AdminTable({ headers, children }: AdminTableProps) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider first:pl-8 last:pr-8"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {children}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function AdminTableRow({ children }: { children: React.ReactNode }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors">
            {children}
        </tr>
    )
}

export function AdminTableCell({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return (
        <td className={`px-6 py-4 text-sm text-slate-600 font-medium first:pl-8 last:pr-8 ${className}`}>
            {children}
        </td>
    )
}
