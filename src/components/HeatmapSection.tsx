import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const HeatmapSection = () => {
    // Motion values for the "ghost" cursor
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Hyper-active spring physics: Very high stiffness for instant snaps, low damping for a tiny bit of overshoot/zip
    const springConfig = { damping: 25, stiffness: 800, mass: 0.5 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        let animationFrameId: number;
        let lastStateChange = Date.now();
        let state: 'FIXATION' | 'SACCADE' = 'FIXATION';
        let fixationDuration = 0;
        let currentPointIndex = 0;

        // More chaotic, scattered "hyper-scan" path
        const pathPoints = [
            { x: -300, y: -120 }, { x: 200, y: -100 }, { x: -100, y: -80 },
            { x: 350, y: -50 }, { x: -400, y: 0 }, { x: 100, y: 50 },
            { x: -200, y: 150 }, { x: 300, y: 200 }, { x: 0, y: -200 },
            { x: 450, y: 100 }, { x: -450, y: -150 }, { x: 50, y: 0 }
        ];

        const getNextDuration = (type: 'FIXATION' | 'SACCADE') => {
            // Rapid-fire fixations: 40ms to 180ms
            if (type === 'FIXATION') return 40 + Math.random() * 140;
            return 20; // Saccade handover speed
        };

        fixationDuration = getNextDuration('FIXATION');
        let currentTarget = pathPoints[0];

        const update = () => {
            const now = Date.now();
            const timeInState = now - lastStateChange;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            if (state === 'FIXATION') {
                // Intense jitter during fixation
                const jitterAmount = 8;
                const noiseX = (Math.random() - 0.5) * jitterAmount;
                const noiseY = (Math.random() - 0.5) * jitterAmount;

                cursorX.set(centerX + currentTarget.x + noiseX);
                cursorY.set(centerY + currentTarget.y + noiseY);

                if (timeInState > fixationDuration) {
                    state = 'SACCADE';
                    lastStateChange = now;

                    // Pick a random next point for more chaos
                    const nextIndex = Math.floor(Math.random() * pathPoints.length);
                    currentTarget = pathPoints[nextIndex];
                }
            } else if (state === 'SACCADE') {
                // Snap to new target
                cursorX.set(centerX + currentTarget.x);
                cursorY.set(centerY + currentTarget.y);

                if (timeInState > 30) { // Very fast flight time
                    state = 'FIXATION';
                    lastStateChange = now;
                    fixationDuration = getNextDuration('FIXATION');
                }
            }

            animationFrameId = requestAnimationFrame(update);
        };

        update();
        return () => cancelAnimationFrame(animationFrameId);
    }, [cursorX, cursorY]);

    return (
        <section className="relative w-full h-[85vh] bg-[#050505] overflow-hidden flex items-center justify-center">
            {/* Background Text layer - More visible as requested */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0">
                <h2 className="text-[12vw] font-black text-white/25 leading-none text-center mix-blend-overlay tracking-tighter">
                    NEURUX
                    <br />
                    INTELLIGENCE
                </h2>
                <div className="flex gap-8 mt-6">
                    <p className="text-white/40 text-sm md:text-lg font-mono tracking-widest uppercase">
                        Scanning interface...
                    </p>
                    <p className="text-[#29D9FF]/40 text-sm md:text-lg font-mono tracking-widest uppercase">
                        Saccadic behavior detected
                    </p>
                </div>
                <p className="text-white/20 text-md max-w-3xl mt-12 text-center font-light leading-relaxed hidden md:block">
                    Onze eye-tracking algoritmen analyseren gebruikersgedrag op milliseconde-niveau. <br />
                    Visualiseer de onzichtbare patronen achter elke interactie.
                </p>
            </div>

            {/* Hyper-Active Heatmap Layer */}
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-90">
                <motion.div
                    className="absolute w-[450px] h-[450px] rounded-full mix-blend-screen"
                    style={{
                        x,
                        y,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                >
                    {/* Outer Glow - Greenish */}
                    <motion.div
                        className="absolute inset-0 bg-[#39ff14] blur-[80px] opacity-30"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Mid Glow - Yellow/Orange */}
                    <motion.div
                        className="absolute inset-10 bg-yellow-400 blur-[60px] opacity-50 mix-blend-screen"
                        animate={{
                            rotate: [0, 180, 360],
                            scale: [0.8, 1.1, 0.8]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Hot Core - Red/White */}
                    <motion.div
                        className="absolute inset-20 bg-red-600 blur-[40px] opacity-80"
                        animate={{
                            scale: [0.9, 1.3, 0.9],
                        }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                    />

                    {/* Sharp Core for "Intensity" */}
                    <div className="absolute inset-32 bg-white blur-[20px] opacity-40 rounded-full" />
                </motion.div>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 border-l border-t border-white/20 w-20 h-20 pointer-events-none" />
            <div className="absolute bottom-10 right-10 border-r border-b border-white/20 w-20 h-20 pointer-events-none" />
        </section>
    );
};

export default HeatmapSection;
