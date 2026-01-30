import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

const StickyCTA = () => {
    const ref = useRef<HTMLAnchorElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const contactSection = document.getElementById('contact-form');
            if (!contactSection) return;

            const contactTop = contactSection.offsetTop;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Show button after hero (0.8vh) AND hide before contact section
            // We hide it when the bottom of the viewport reaches the contact section
            if (scrollY > windowHeight * 0.8 && scrollY + windowHeight < contactTop + 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);
        setPosition({ x: x * 0.2, y: y * 0.2 }); // Gentle magnetic pull
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div className={`fixed bottom-8 right-8 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <motion.a
                href="#contact-form"
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
                className="relative flex items-center gap-3 px-6 py-4 bg-[#29D9FF] rounded-full shadow-[0_0_30px_rgba(57,255,20,0.4)] cursor-pointer group hover:scale-105 transition-transform duration-300"
            >
                {/* Animated Rings */}
                <div className="absolute inset-0 rounded-full border border-[#29D9FF] opacity-50 animate-ping duration-[2000ms]"></div>

                {/* Icon Container */}
                <div className="relative bg-black text-[#29D9FF] p-1.5 rounded-full">
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>

                {/* Text Content */}
                <span className="text-black font-bold uppercase tracking-wider text-sm whitespace-nowrap">
                    Start Project
                </span>
            </motion.a>
        </div>
    );
};

export default StickyCTA;
