import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

interface PathSegment {
    id: number;
    start: { x: number; y: number };
    end: { x: number; y: number };
}

const HeatmapSection = () => {
    // Motion values for the "ghost" cursor
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Balanced spring physics: Smooth but fast enough to feel like a scan.
    const springConfig = { damping: 35, stiffness: 350, mass: 1 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    const [segments, setSegments] = useState<PathSegment[]>([]);
    const prevPosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let animationFrameId: number;
        let lastStateChange = Date.now();
        let state: 'FIXATION' | 'SACCADE' = 'FIXATION';
        let fixationDuration = 0;
        let currentPointIndex = 0;

        // Structured scanning with some interest jumps
        const pathPoints = [
            // First header row
            { x: -280, y: -90 }, { x: -80, y: -95 }, { x: 120, y: -85 }, { x: 300, y: -90 },
            // Second header row
            { x: -300, y: 10 }, { x: -50, y: 15 }, { x: 200, y: 10 }, { x: 400, y: 20 },
            // Paragraph area
            { x: -150, y: 120 }, { x: 50, y: 115 }, { x: 250, y: 125 },
            // Interest points
            { x: 0, y: 0 }, { x: -400, y: -150 }, { x: 400, y: 180 }
        ];

        const getNextDuration = (type: 'FIXATION' | 'SACCADE') => {
            // Balanced fixations: 350ms to 800ms
            if (type === 'FIXATION') return 350 + Math.random() * 450;
            return 50; // Saccade handover speed
        };

        fixationDuration = getNextDuration('FIXATION');
        let currentTarget = pathPoints[0];

        const update = () => {
            const now = Date.now();
            const timeInState = now - lastStateChange;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            if (state === 'FIXATION') {
                // Subtle jitter (Micro-saccades)
                const jitterAmount = 4;
                const noiseX = (Math.random() - 0.5) * jitterAmount;
                const noiseY = (Math.random() - 0.5) * jitterAmount;

                cursorX.set(centerX + currentTarget.x + noiseX);
                cursorY.set(centerY + currentTarget.y + noiseY);

                if (timeInState > fixationDuration) {
                    state = 'SACCADE';
                    lastStateChange = now;

                    // Store current position as start of next saccade
                    prevPosRef.current = { x: currentTarget.x, y: currentTarget.y };

                    // Proceed in path, but occasionally skip or re-read
                    if (Math.random() < 0.15) {
                        currentPointIndex = Math.floor(Math.random() * pathPoints.length);
                    } else {
                        currentPointIndex = (currentPointIndex + 1) % pathPoints.length;
                    }
                    currentTarget = pathPoints[currentPointIndex];
                }
            } else if (state === 'SACCADE') {
                cursorX.set(centerX + currentTarget.x);
                cursorY.set(centerY + currentTarget.y);

                if (timeInState > 80) { // Enough time for the spring to "zip" smoothly
                    // Record the jump as a segment
                    const newSegment: PathSegment = {
                        id: Date.now(),
                        start: { ...prevPosRef.current },
                        end: { x: currentTarget.x, y: currentTarget.y }
                    };

                    setSegments(prev => [...prev.slice(-6), newSegment]);

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
            {/* Background Text layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0">
                <h2 className="text-[12vw] font-black text-white/20 leading-none text-center mix-blend-overlay tracking-tighter">
                    NEURUX
                    <br />
                    INTELLIGENCE
                </h2>
                <div className="flex gap-8 mt-6">
                    <p className="text-white/30 text-xs md:text-sm font-mono tracking-widest uppercase">
                        AI Scanning...
                    </p>
                    <p className="text-[#29D9FF]/30 text-xs md:text-sm font-mono tracking-widest uppercase">
                        Gaze Path Analysis
                    </p>
                </div>
                <p className="text-white/15 text-md max-w-3xl mt-12 text-center font-light leading-relaxed hidden md:block">
                    Onze eye-tracking algoritmen analyseren gebruikersgedrag op milliseconde-niveau. <br />
                    Visualiseer de onzichtbare patronen achter elke interactie.
                </p>
            </div>

            {/* Saccade Path Layer (SVG) */}
            <svg className="absolute inset-0 pointer-events-none z-5 w-full h-full opacity-40">
                <AnimatePresence>
                    {segments.map((seg) => (
                        <motion.line
                            key={seg.id}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{
                                pathLength: { duration: 0.3, ease: "easeOut" },
                                opacity: { duration: 3, times: [0, 0.1, 1] }
                            }}
                            x1={`calc(50% + ${seg.start.x}px)`}
                            y1={`calc(50% + ${seg.start.y}px)`}
                            x2={`calc(50% + ${seg.end.x}px)`}
                            y2={`calc(50% + ${seg.end.y}px)`}
                            stroke="#29D9FF"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            style={{ filter: "blur(0.5px)" }}
                        />
                    ))}
                </AnimatePresence>
            </svg>

            {/* Balanced Heatmap Layer */}
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
                    {/* Outer Glow - Deep Blue/Green */}
                    <motion.div
                        className="absolute inset-0 bg-[#39ff14] blur-[100px] opacity-20"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.15, 0.25, 0.15]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Mid Glow - Electric Indigo / Cyanish */}
                    <motion.div
                        className="absolute inset-10 bg-[#29D9FF] blur-[70px] opacity-40 mix-blend-screen"
                        animate={{
                            rotate: [0, 90, 180, 270, 360],
                            scale: [0.9, 1.05, 0.9]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Hot Core - Bright Cyan/White */}
                    <motion.div
                        className="absolute inset-20 bg-white/80 blur-[50px] opacity-60"
                        animate={{
                            scale: [0.95, 1.1, 0.95],
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    />

                    {/* Inner Core Focus */}
                    <div className="absolute inset-32 bg-white blur-[25px] opacity-30 rounded-full" />
                </motion.div>
            </div>

            {/* HUD Decoration */}
            <div className="absolute top-10 left-10 border-l border-t border-white/10 w-16 h-16 pointer-events-none opacity-50" />
            <div className="absolute bottom-10 right-10 border-r border-b border-white/10 w-16 h-16 pointer-events-none opacity-50" />
        </section>
    );
};

export default HeatmapSection;
