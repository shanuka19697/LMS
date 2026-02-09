"use client";

import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    <div className="space-y-8">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl lg:text-5xl font-bold font-heading"
                        >
                            Get in <span className="text-blue-400">Touch</span>
                        </motion.h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Have questions or want to learn more about our platform? We&apos;d love to hear from you.
                            Our team is ready to assist you.
                        </p>

                        <div className="space-y-6">
                            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email Us</p>
                                    <p className="font-semibold font-heading text-lg">support@lms.com</p>
                                </div>
                            </div>
                            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Call Us</p>
                                    <p className="font-semibold font-heading text-lg">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Visit Us</p>
                                    <p className="font-semibold font-heading text-lg">San Francisco, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl"
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">First Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-500" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Last Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-500" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email</label>
                                <input type="email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-all outline-none text-white placeholder-gray-500" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 transition-all outline-none resize-none text-white placeholder-gray-500" placeholder="How can we help?" />
                            </div>
                            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold font-heading text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
                                Send Message
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.form>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    <p>&copy; 2024 LMS Platform. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
