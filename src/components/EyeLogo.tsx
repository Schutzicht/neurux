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
    return (
        <div
            ref={eyeRef}
            className="w-10 h-10 logo-container rounded-full bg-[#29D9FF] flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_#29D9FF] transition-all duration-500 group-hover:rotate-0 border-2 border-white/10"
        >
            {/* Simple internal shadow for depth without being "realistic" */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.2),_transparent)] z-10"></div>

            {/* Moving Pupil - Clean Black Circle */}
            <div
                className="relative z-20 w-3.5 h-3.5 bg-black rounded-full shadow-sm transition-transform duration-75 ease-out"
                style={{
                    transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`
                }}
            />
        </div>
    );
    );
};

export default EyeLogo;
