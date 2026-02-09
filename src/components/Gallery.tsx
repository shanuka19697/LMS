"use client";

import { motion } from "framer-motion";

const Gallery = () => {
    const items = [
        { title: "Digital Classroom", color: "from-blue-400 to-blue-600", span: "md:col-span-2 md:row-span-2" },
        { title: "Student Collaboration", color: "from-red-400 to-red-600", span: "md:col-span-1 md:row-span-1" },
        { title: "Virtual Library", color: "from-purple-400 to-purple-600", span: "md:col-span-1 md:row-span-1" },
        { title: "Expert Mentors", color: "from-green-400 to-green-600", span: "md:col-span-1 md:row-span-2" },
        { title: "Global Events", color: "from-yellow-400 to-orange-500", span: "md:col-span-1 md:row-span-1" },
    ];

    return (
        <section id="gallery" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold font-heading text-gray-900 mb-4">Our <span className="text-secondary">Gallery</span></h2>
                    <p className="text-lg text-gray-600">Glimpses into the future of education.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group ${item.span}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90 transition-opacity group-hover:opacity-100`} />

                            <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                                <h3 className="text-white text-2xl font-bold font-heading opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 drop-shadow-md">
                                    {item.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
