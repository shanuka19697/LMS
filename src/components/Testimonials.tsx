"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const Testimonials = () => {
    const reviews = [
        {
            name: "Sarah Johnson",
            role: "UX Designer",
            content: "This platform completely transformed my career path. The courses are structured perfectly.",
            avatar: "bg-blue-100 text-blue-600",
            initial: "S"
        },
        {
            name: "Michael Chen",
            role: "Web Developer",
            content: "I've tried many LMS platforms, but this one stands out for its community and expert content.",
            avatar: "bg-red-100 text-red-600",
            initial: "M"
        },
        {
            name: "Emily Davis",
            role: "Product Manager",
            content: "The analytics features help me track my progress and stay motivated. Highly recommended!",
            avatar: "bg-green-100 text-green-600",
            initial: "E"
        }
    ];

    return (
        <section id="testimonials" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-6">
                        Loved by <span className="text-secondary">Students</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our community has to say about their learning experience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 relative group"
                        >
                            {/* Decorative Quote */}
                            <div className="absolute top-6 right-8 text-6xl text-gray-100 font-serif opacity-50 group-hover:text-blue-50 transition-colors">
                                &rdquo;
                            </div>

                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed relative z-10">
                                &ldquo;{review.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${review.avatar} flex items-center justify-center font-bold text-xl`}>
                                    {review.initial}
                                </div>
                                <div>
                                    <h4 className="font-bold font-heading text-gray-900">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
