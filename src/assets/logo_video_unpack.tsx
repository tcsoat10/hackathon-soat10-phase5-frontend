// Logo component svg

import React from 'react';

const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" {...props} role="img" aria-label="Logo Video Unpack">
        <title>Logo Video Unpack</title>
        <defs>
            <linearGradient id="grad2-enhanced" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="glow-enhanced">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#glow-enhanced)">
            <path d="M 10,15 L 25,5 L 40,15 L 25,25 Z" fill="url(#grad2-enhanced)" opacity="0.7"/>
            <path d="M 10,15 V 35 L 25,45 V 25 Z" fill="url(#grad2-enhanced)" opacity="0.8"/>
            <path d="M 40,15 V 35 L 25,45 V 25 Z" fill="url(#grad2-enhanced)" opacity="0.6"/>
            <polygon points="22,23 32,28 22,33" fill="white"/>
        </g>
    </svg>
);

export default Logo;
