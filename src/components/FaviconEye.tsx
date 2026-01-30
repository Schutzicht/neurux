import React, { useEffect } from 'react';

const FaviconEye = () => {
    useEffect(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Find the favicon link element
        let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        const drawEye = (mouseX: number, mouseY: number) => {
            if (!ctx) return;

            // Clear
            ctx.clearRect(0, 0, 32, 32);

            // Eye background (Outer Blue - matching Neurux theme)
            ctx.beginPath();
            ctx.arc(16, 16, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#29D9FF';
            ctx.fill();

            // Inner White
            ctx.beginPath();
            ctx.arc(16, 16, 10, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();

            // Pupil Calculation
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            // Calculate angle from center to mouse
            const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            const distance = Math.min(Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)) / 100, 5);

            const pupilX = 16 + Math.cos(angle) * distance;
            const pupilY = 16 + Math.sin(angle) * distance;

            // Pupil (Black)
            ctx.beginPath();
            ctx.arc(pupilX, pupilY, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#000000';
            ctx.fill();

            // Update favicon
            link.href = canvas.toDataURL('image/png');
        };

        const handleMouseMove = (e: MouseEvent) => {
            drawEye(e.clientX, e.clientY);
        };

        // Initial draw (center)
        drawEye(window.innerWidth / 2, window.innerHeight / 2);

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return null; // This component doesn't render anything to the DOM
};

export default FaviconEye;
