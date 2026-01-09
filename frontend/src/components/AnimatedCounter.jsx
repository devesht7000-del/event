import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        let animationFrame;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);

            if (progress < 1) {
                // Parse the end value (remove non-numeric characters except decimal point)
                const numericEnd = parseFloat(end.toString().replace(/[^0-9.]/g, ''));
                setCount(Math.floor(numericEnd * progress));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isInView, end, duration]);

    return (
        <span ref={ref}>
            {count}{suffix}
        </span>
    );
};

export default AnimatedCounter;
