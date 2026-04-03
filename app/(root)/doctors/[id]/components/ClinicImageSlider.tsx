"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicImageSliderProps {
    images: string[];
}

export function ClinicImageSlider({ images }: ClinicImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Auto-play
    useEffect(() => {
        if (images.length <= 1 || isModalOpen) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex, images.length, isModalOpen]);

    if (!images || images.length === 0) return null;

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
        }),
    };

    return (
        <>
            <div className="relative w-full aspect-16/10 sm:aspect-16/8 rounded-3xl overflow-hidden group shadow-2xl border border-white/20">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Eye Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        animate={{ 
                            opacity: 0, 
                            scale: 0.5,
                            transition: { duration: 0.2 }
                        }}
                        whileInView={{
                            opacity: 1,
                            scale: 1,
                            transition: { delay: 0.1 }
                        }}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-2xl group-hover:opacity-100 opacity-0 transition-opacity pointer-events-auto"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Eye className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-10">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > currentIndex ? 1 : -1);
                                    setCurrentIndex(i);
                                }}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    i === currentIndex
                                        ? "w-8 bg-white"
                                        : "w-2 bg-white/40 hover:bg-white/60"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Full Screen Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-9999 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12"
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 transition-all z-50"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <motion.img
                                src={images[currentIndex]}
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
