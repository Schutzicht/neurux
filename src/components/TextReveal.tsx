import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
    text: string;
    className?: string;
}

export const TextReveal = ({ text, className }: Props) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start 0.9", "start 0.25"],
    });

    const words = text.split(" ");

    return (
        <p ref={container} className={`flex flex-wrap ${className}`}>
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                    <Word key={i} progress={scrollYProgress} range={[start, end]}>
                        {word}
                    </Word>
                );
            })}
        </p>
    );
};

const Word = ({ children, progress, range }: { children: string; progress: any; range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    return (
        <span className="relative mr-2 mt-2">
            <span className="absolute opacity-20">{children}</span>
            <motion.span style={{ opacity: opacity }}>{children}</motion.span>
        </span>
    );
};

export default TextReveal;
