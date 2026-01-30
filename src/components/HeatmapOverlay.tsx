import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HeatmapOverlay = () => {
    // Generate random positions or predefined "interest points"
    // We want the gaze to look at the title, the CTA, the subtitle, etc.

    // Using predefined relative positions (%) for better control on different screens
    // [x, y]
    const interestPoints = [
        [50, 40], // Center Title
        [20, 30], // Left side abstract
        [80, 60], // Right side
        [50, 70], // CTA buttons
        [30, 50], // Mid-left
        [70, 20], // Top-right
    ];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Gaze Point 1 - Large Red/Orange Hotspot */}
            <GazePoint
                points={interestPoints}
                color="rgba(255, 69, 0, 0.4)" // Red-Orange
                size={300}
                duration={8}
                delay={0}
            />
            {/* Gaze Point 2 - Smaller Yellow/Green Intense Spot */}
            <GazePoint
                points={[...interestPoints].reverse()}
                color="rgba(57, 255, 20, 0.3)" // Neon Green
                size={200}
                duration={10}
                delay={2}
            />
            {/* Gaze Point 3 - Blue/Purple Cool Spot */}
            <GazePoint
                points={[[10, 10], [90, 90], [10, 90], [90, 10]]}
                color="rgba(0, 243, 255, 0.2)" // Cyan
                size={400}
                duration={15}
                delay={1}
            />

            {/* Overlay Grid to make it look like analysis software */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />
        </div>
    );
};

const GazePoint = ({ points, color, size, duration, delay }: { points: number[][], color: string, size: number, duration: number, delay: number }) => {
    // Convert % to vw/vh roughly or just use % directly in animate
    const keyframes = points.map(p => ({
        left: `${p[0]}%`,
        top: `${p[1]}%`,
    }));

    return (
        <motion.div
            className="absolute rounded-full filter blur-[60px] mix-blend-screen"
            style={{
                backgroundColor: color,
                width: size,
                height: size,
            }}
            animate={{
                left: keyframes.map(k => k.left),
                top: keyframes.map(k => k.top),
                scale: [1, 1.2, 0.9, 1.1, 1], // Breathing effect
                opacity: [0.3, 0.6, 0.3, 0.5], // Pulsing opacity
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: delay,
                times: points.map((_, i) => i / (points.length - 1)) // Distribute evenly
            }}
        />
    );
};

export default HeatmapOverlay;
