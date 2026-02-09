import { Clock, AlertCircle } from "lucide-react";

const UpcomingDeadlines = () => {
    const deadlines = [
        {
            title: "React Components Quiz",
            course: "Modern Web Development",
            due: "Today, 11:59 PM",
            urgent: true,
        },
        {
            title: "Usability Testing Report",
            course: "UI/UX Design",
            due: "Tomorrow, 5:00 PM",
            urgent: false,
        },
        {
            title: "Marketing Strategy Draft",
            course: "Digital Marketing",
            due: "Sep 24, 2024",
            urgent: false,
        },
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-bold font-heading text-gray-900 mb-6">Upcoming Deadlines</h3>

            <div className="space-y-4">
                {deadlines.map((item, index) => (
                    <div key={index} className={`p-4 rounded-2xl border ${item.urgent ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'} transition-all hover:bg-white hover:shadow-md`}>
                        <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.urgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                {item.course}
                            </span>
                            {item.urgent && <AlertCircle className="w-4 h-4 text-red-500" />}
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {item.due}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingDeadlines;
