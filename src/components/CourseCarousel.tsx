"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { Star, Clock, BookOpen, ArrowRight } from "lucide-react";

interface Course {
    id: number;
    title: string;
    category: string;
    image: string;
    rating: number;
    students: string;
    duration: string;
    lessons: number;
}

const CourseCarousel = () => {
    const [width, setWidth] = useState(0);
    const carousel = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }
    }, []);

    const courses: Course[] = [
        {
            id: 1,
            title: "Modern Web Development Bootcamp",
            category: "Development",
            image: "/images/course_webdev.png",
            rating: 4.9,
            students: "12k",
            duration: "45h",
            lessons: 120,
        },
        {
            id: 2,
            title: "UI/UX Design Masterclass",
            category: "Design",
            image: "/images/course_design.png",
            rating: 4.8,
            students: "8.5k",
            duration: "32h",
            lessons: 85,
        },
        {
            id: 3,
            title: "Digital Marketing & Growth",
            category: "Business",
            image: "/images/course_business.png",
            rating: 4.7,
            students: "15k",
            duration: "28h",
            lessons: 60,
        },
        // Duplicate for scroll depth in demo - REMOVED
        {
            id: 5,
            title: "Product Design Principles",
            category: "Design",
            image: "/images/course_design.png",
            rating: 4.8,
            students: "3k",
            duration: "20h",
            lessons: 55,
        },
    ];

    return (
        <section id="courses" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-4">
                        Explore Our <span className="text-primary">Top Courses</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-xl">
                        Expert-led courses designed to help you master new skills and advance your career.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button className="px-6 py-3 rounded-full border border-gray-200 font-medium hover:border-blue-500 hover:text-blue-500 transition-colors">
                        View All Courses
                    </button>
                </div>
            </div>

            <div className="pl-4 sm:pl-6 lg:pl-8">
                <motion.div ref={carousel} className="cursor-grab active:cursor-grabbing overflow-hidden">
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        whileTap={{ cursor: "grabbing" }}
                        className="flex gap-8 pb-12"
                    >
                        {courses.map((course) => (
                            <motion.div
                                key={course.id}
                                className="min-w-[350px] md:min-w-[400px] bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-shadow duration-300 relative group overflow-hidden"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold font-heading uppercase tracking-wide text-primary">
                                        {course.category}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {course.rating}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.duration}</span>
                                        <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.lessons} Lessons</span>
                                    </div>

                                    <h3 className="text-2xl font-bold font-heading text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <div className="flex justify-between items-center border-t border-gray-100 pt-6 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">I</div>
                                            <span className="text-sm font-medium text-gray-600">Instructor</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default CourseCarousel;
