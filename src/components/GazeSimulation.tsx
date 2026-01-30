import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const GazeSimulation = () => {
    // Interest Points (x, y in %)
    // Updated to include Header elements (Top of screen) and Hero elements
    const points = [
        { x: 10, y: 5, duration: 2500 }, // Logo (Top Left) - Long fixation
        { x: 50, y: 35, duration: 1500 }, // H1 "SEEING IS"
        { x: 50, y: 45, duration: 2000 }, // H1 "BELIEVING" - Important
        { x: 85, y: 5, duration: 1000 }, // Header Menu (Top Right)
        { x: 50, y: 5, duration: 800 }, // Quickly scanning header
        { x: 50, y: 50, duration: 500 }, // Center screen
        { x: 35, y: 75, duration: 2000 }, // CTA "Start Onderzoek"
        { x: 65, y: 75, duration: 1000 }, // CTA "Bekijk Cases"
    ];

    // Colors: Green -> Yellow -> Red
    // We will animate the color based on 'isFixating' duration

    const [isFixating, setIsFixating] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        let currentIndex = 0;

        const animateGaze = async () => {
            while (true) {
                const target = points[currentIndex];

                // Saccade (Move)
                setIsFixating(false);
                await controls.start({
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    transition: { duration: 0.4, ease: "easeInOut" }
                });

                // Fixation (Dwell)
                setIsFixating(true);
                await new Promise(resolve => setTimeout(resolve, target.duration));

                currentIndex = (currentIndex + 1) % points.length;
            }
        };

        animateGaze();
    }, [controls]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                animate={controls}
                initial={{ left: "50%", top: "50%" }}
            >
                {/* 
                    Heatmap Logic:
                    Green (Initial attention) -> Yellow (Interest) -> Red (High engagement/Dwell)
                */}
                <motion.div
                    className="w-32 h-32 rounded-full blur-[40px] mix-blend-screen opacity-70"
                    animate={{
                        backgroundColor: isFixating ? ["#00ff00", "#ffff00", "#ff0000"] : "#00ff00",
                        scale: isFixating ? [1, 1.2, 1.5] : 0.5
                    }}
                    transition={{
                        duration: 2, // Takes 2 seconds to go Green -> Red
                        times: [0, 0.5, 1],
                        ease: "linear"
                    }}
                />

                {/* Core of the gaze */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full blur-md opacity-50"
                />
            </motion.div>
        </div>
    );
};

export default GazeSimulation;
