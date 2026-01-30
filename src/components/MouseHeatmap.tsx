import React, { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const MouseHeatmap = () => {
    const cursorX = useMotionValue(-500);
    const cursorY = useMotionValue(-500);

    // Smooth spring animation for the heatmap to follow somewhat organically but tight
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full mix-blend-screen opacity-90"
                style={{
                    x,
                    y,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: `background: rgb(255,0,0);
background: radial-gradient(circle, rgba(255,0,0,0.9) 0%, rgba(255,165,0,0.8) 25%, rgba(57,255,20,0.6) 50%, rgba(57,255,20,0) 70%);`
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
    );
};

export default MouseHeatmap;
