"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How do I start a course?",
            answer: "Starting a course is simple. Just sign up, browse our catalog, and click 'Enroll' on any course that interests you. You'll get immediate access to all learning materials."
        },
        {
            question: "Can I access the LMS on mobile?",
            answer: "Yes! Our platform is fully responsive and optimized for all devices, so you can learn on the go from your smartphone or tablet."
        },
        {
            question: "Are certificates provided?",
            answer: "Absolutely. Upon successful completion of a course, you will receive a verified certificate that you can add to your resume or LinkedIn profile."
        },
        {
            question: "What if I need help?",
            answer: "Our support team is available 24/7. You can also connect with instructors and peers in the community forums for assistance."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-white/50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl lg:text-5xl font-bold font-heading text-center text-gray-900 mb-12">
                    Frequently Asked <span className="text-primary">Questions</span>
                </h2>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-gray-200 rounded-2xl overflow-hidden bg-white hover:border-blue-200 transition-colors duration-300 shadow-sm"
                        >
                            <button
                                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left bg-transparent hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-bold font-heading text-gray-900">{faq.question}</span>
                                {activeIndex === index ? (
                                    <div className="p-2 bg-red-50 rounded-full text-secondary">
                                        <Minus className="w-4 h-4" />
                                    </div>
                                ) : (
                                    <div className="p-2 bg-blue-50 rounded-full text-primary">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-gray-600 bg-transparent leading-relaxed border-t border-gray-100">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
