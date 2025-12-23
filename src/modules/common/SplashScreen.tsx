import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
            setTimeout(onComplete, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {showSplash && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-50 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center overflow-hidden"
                >
                    <div className="text-center px-6 relative z-10">
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="mb-6"
                        >

                            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            </div>

                            <motion.h1
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-3xl font-bold text-white mb-2"
                            >
                                Bookinga
                            </motion.h1>

                            <motion.p
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="text-white/90 text-lg font-medium"
                            >
                                Book Your Perfect Appointment
                            </motion.p>
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.3 }}
                            className="flex justify-center space-x-1"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1, 0] }}
                                    transition={{
                                        delay: i * 0.15,
                                        duration: 0.8,
                                        repeat: Infinity,
                                        repeatDelay: 0.3
                                    }}
                                    className="w-2 h-2 bg-white rounded-full"
                                />
                            ))}
                        </motion.div>
                    </div>


                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    opacity: 0
                                }}
                                animate={{
                                    x: Math.random() * window.innerWidth,
                                    y: Math.random() * window.innerHeight,
                                    opacity: [0, 0.2, 0]
                                }}
                                transition={{
                                    duration: 2 + Math.random() * 1.5,
                                    repeat: Infinity,
                                    delay: Math.random() * 1.5
                                }}
                                className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;