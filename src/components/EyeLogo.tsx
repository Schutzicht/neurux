import React, { useEffect, useRef, useState } from "react";

const EyeLogo = () => {
    const eyeRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!eyeRef.current) return;

            // Get eye center position
            const rect = eyeRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Calculate angle and distance
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX);

            // Limit distance so pupil stays within eye
            // Eye radius is approx 20px (w-10), pupil is 12px (w-3), padding/border etc.
            // Let's cap movement to ~6px radius
            const maxDistance = 6;

            // Calculate normalized distance (0 to 1) for clamping
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 500); // 500 max range for effect
            const moveDistance = Math.min(distance / 20, maxDistance);

            const x = Math.cos(angle) * moveDistance;
            const y = Math.sin(angle) * moveDistance;

            setPupilPos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={eyeRef}
            className="w-10 h-10 logo-container rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_#29D9FF] transition-all duration-500 group-hover:rotate-0 border border-[#29D9FF]/30"
            style={{
                background: 'radial-gradient(circle at 30% 30%, #4ae2ff 0%, #29D9FF 40%, #0066ff 100%)' // Depth gradient
            }}
        >
            {/* Iris Texture (subtle) */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-conic-gradient(from_0deg,_transparent_0deg_10deg,_#000_10deg_20deg)] mix-blend-overlay"></div>

            {/* Glare/Reflection (Crucial for "Eye" look) */}
            <div className="absolute top-1.5 right-2 w-2.5 h-1.5 bg-white rounded-full opacity-60 rotate-[-15deg] z-20 blur-[0.5px]"></div>

            {/* Moving Pupil */}
            <div
                className="relative z-10 w-3.5 h-3.5 bg-black rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.8)] transition-transform duration-75 ease-out flex items-center justify-center"
                style={{
                    transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`
                }}
            >
                {/* Pupil highlight */}
                <div className="w-1 h-1 bg-white/10 rounded-full blur-[0.5px] absolute top-0.5 right-0.5"></div>
            </div>
        </div>
    );
};

export default EyeLogo;
