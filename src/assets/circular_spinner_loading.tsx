import React from 'react';

const CircularSpinner: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="200"
        height="200"
        {...props}
    >
        <g>
            <circle
                strokeLinecap="round"
                fill="none"
                strokeDasharray="50.26548245743669 50.26548245743669"
                stroke="#1d4ed8"
                strokeWidth={8}
                r={32}
                cy={50}
                cx={50}
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>

            <circle
                strokeLinecap="round"
                fill="none"
                strokeDashoffset="36.12831551628262"
                strokeDasharray="36.12831551628262 36.12831551628262"
                stroke="#fff"
                strokeWidth={8}
                r={23}
                cy={50}
                cx={50}
            >
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="0 50 50;-360 50 50"
                    keyTimes="0;1"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
    </svg>
);

export default CircularSpinner;
