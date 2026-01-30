import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const MouseHeatmap = () => {
    const cursorX = useMotionValue(-500);
    const cursorY = useMotionValue(-500);
    const [isMobile, setIsMobile] = useState(false);

    // Smooth spring animation for the heatmap to follow somewhat organically but tight
    const [intensity, setIntensity] = useState(0);
    const lastMoveTime = React.useRef(Date.now());

    // Smooth spring animation for the heatmap to follow somewhat organically but tight
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(pointer: coarse)").matches);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);

        if (!isMobile) {
            const handleMouseMove = (e: MouseEvent) => {
                cursorX.set(e.clientX);
                cursorY.set(e.clientY);
                lastMoveTime.current = Date.now();
                setIntensity(0); // Reset intensity immediately on move
            };

            // Timer to check for stationarity and increase intensity
            const interval = setInterval(() => {
                const now = Date.now();
                if (now - lastMoveTime.current > 100) {
                    // Mouse has been stationary for 100ms
                    setIntensity(prev => Math.min(prev + 0.05, 1));
                }
            }, 50);

            window.addEventListener("mousemove", handleMouseMove);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("resize", checkMobile);
                clearInterval(interval);
            }
        }

        return () => window.removeEventListener("resize", checkMobile);
    }, [isMobile]);

    if (isMobile) {
        return (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full mix-blend-screen opacity-90"
                    animate={{
                        x: [0, window.innerWidth - 300, window.innerWidth / 2, 0],
                        y: [0, window.innerHeight / 2, window.innerHeight - 300, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "linear"
                    }}
                    style={{
                        background: `radial-gradient(circle, rgba(255,0,0,0.9) 0%, rgba(255,165,0,0.8) 25%, rgba(57,255,20,0.6) 50%, rgba(57,255,20,0) 70%)`
                    }}
                >
                    {/* Inner intense core */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600 blur-2xl rounded-full opacity-90"></div>
                    {/* Mid warmth */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500 blur-3xl rounded-full opacity-70"></div>
                    {/* Outer cool */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39ff14] blur-[80px] rounded-full opacity-50"></div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div
                className="absolute w-[400px] h-[400px] rounded-full mix-blend-screen opacity-90"
                style={{
                    x,
                    y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                {/* 
                    Organic Blob Layers 
                    Using border-radius to create non-circular, morphing shapes 
                */}

                {/* Outer cool - Blue/Cyan/Green halo - Largest Blob */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 blur-[80px] opacity-20"
                    animate={{
                        borderRadius: [
                            "60% 40% 30% 70% / 60% 30% 70% 40%",
                            "30% 60% 70% 40% / 50% 60% 30% 60%",
                            "60% 40% 30% 70% / 60% 30% 70% 40%"
                        ],
                        rotate: [0, 90, 0],
                        scale: isMobile ? 1 : [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        background: `radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(0,255,0,0.1) 60%, rgba(0,0,255,0) 80%)`
                    }}
                />

                {/* Mid warmth - Yellow/Green/Orange - Medium Blob */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-yellow-400 blur-[50px] opacity-40 mix-blend-screen"
                    animate={{
                        borderRadius: [
                            "40% 60% 70% 30% / 40% 50% 60% 50%",
                            "60% 30% 50% 70% / 70% 30% 60% 40%",
                            "40% 60% 70% 30% / 40% 50% 60% 50%"
                        ],
                        rotate: [0, -60, 0],
                        opacity: 0.5 + (intensity * 0.2),
                        scale: 1 + (intensity * 0.1),
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        background: `radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(173,255,47,0.3) 50%, rgba(0,255,0,0) 70%)`
                    }}
                />

                {/* Inner intense core - Red/Orange - Smallest Blob */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-red-600 blur-[40px] mix-blend-screen"
                    animate={{
                        borderRadius: [
                            "70% 30% 50% 50% / 30% 50% 70% 70%",
                            "50% 70% 30% 70% / 70% 30% 50% 40%",
                            "70% 30% 50% 50% / 30% 50% 70% 70%"
                        ],
                        rotate: [0, 120, 0],
                        opacity: 0.6 + (intensity * 0.4),
                        scale: 1 + (intensity * 0.1),
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        background: `radial-gradient(circle, rgba(255,0,0,${0.7 + (intensity * 0.3)}) 0%, rgba(255,69,0,${0.5 + (intensity * 0.2)}) 40%, rgba(255,140,0,0) 70%)`
                    }}
                />
            </motion.div>
        </div>
    );
};

export default MouseHeatmap;
