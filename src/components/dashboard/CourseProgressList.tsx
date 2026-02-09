"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CourseProgressList = () => {
    const courses = [
        {
            id: 1,
            title: "Modern Web Development Bootcamp",
            progress: 75,
            totalLessons: 120,
            completedLessons: 90,
            image: "/images/course_webdev.png",
            color: "bg-blue-500"
        },
        {
            id: 2,
            title: "UI/UX Design Masterclass",
            progress: 45,
            totalLessons: 85,
            completedLessons: 38,
            image: "/images/course_design.png",
            color: "bg-purple-500"
        },
        {
            id: 3,
            title: "Digital Marketing & Growth",
            progress: 20,
            totalLessons: 60,
            completedLessons: 12,
            image: "/images/course_business.png",
            color: "bg-red-500"
        }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-heading text-gray-900">Course Tracking</h3>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 font-medium">View Schedule</button>
            </div>

            <div className="space-y-6">
                {courses.map((course) => (
                    <div key={course.id} className="group">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                <Image src={course.image} alt={course.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold font-heading text-gray-900 truncate group-hover:text-primary transition-colors">{course.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{course.completedLessons} / {course.totalLessons} Lessons</p>
                            </div>
                        </div>

                        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`absolute top-0 left-0 h-full rounded-full ${course.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 rounded-xl border border-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                Continue Learning <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default CourseProgressList;
