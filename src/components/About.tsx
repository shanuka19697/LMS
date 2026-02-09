"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Trophy, Target } from "lucide-react";

const About = () => {
    const features = [
        {
            icon: <BookOpen className="w-8 h-8 text-blue-500" />,
            title: "Diverse Courses",
            description: "Access widely range of courses from expert instructors tailored to your needs.",
            color: "bg-blue-50",
        },
        {
            icon: <Users className="w-8 h-8 text-red-500" />,
            title: "Community Driven",
            description: "Join a vibrant community of learners and mentors to share knowledge.",
            color: "bg-red-50",
        },
        {
            icon: <Trophy className="w-8 h-8 text-yellow-500" />,
            title: "Gamified Learning",
            description: "Earn badges and certificates as you progress through your learning journey.",
            color: "bg-yellow-50",
        },
        {
            icon: <Target className="w-8 h-8 text-purple-500" />,
            title: "Goal Oriented",
            description: "Set personal goals and track your achievements with analytics.",
            color: "bg-purple-50",
        },
    ];

    return (
        <section id="about" className="py-24 bg-white/50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6"
                    >
                        Why Choose <span className="text-primary">LMS?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        We provide a comprehensive platform that adapts to your learning style and needs, powered by the latest technology.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold font-heading text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-sans">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default About;
