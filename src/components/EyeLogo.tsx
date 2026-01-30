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

            // Limit distance so pupil stays within the white circle
            // Outer (Blue) = w-10 (40px)
            // Inner (White) = w-6 (24px) -> Radius 12px
            // Pupil (Black) = w-3 (12px) -> Radius 6px
            // Max movement = 12px - 6px = 6px.
            // set slightly less than 6 to avoid touching edge perfectly
            const maxDistance = 4.5;

            // Calculate normalized distance with sensitivity cap
            const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 500);
            const moveDistance = Math.min(distance / 15, maxDistance);

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
            className="w-10 h-10 rounded-full bg-[#29D9FF] flex items-center justify-center relative shadow-[0_0_15px_#29D9FF] border-2 border-white/10"
        >
            {/* White Inner Circle (Sclera) */}
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Moving Pupil */}
                <div
                    className="w-3 h-3 bg-black rounded-full relative z-20"
                    style={{
                        transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`
                    }}
                />
            </div>
        </div>
    );
};

export default EyeLogo;
