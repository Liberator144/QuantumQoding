import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: StarBackground.js
 * @version 2.0.0
 */
export function StarBackground() {
    return _jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [[...Array(20)].map((_, i) => _jsx("div", { className: "absolute bg-white rounded-full opacity-60", style: {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: '2px',
                    height: '2px',
                    animation: `twinkle ${2 + Math.random() * 3}s infinite alternate`
                } }, `large-${i}`)), [...Array(40)].map((_, i) => _jsx("div", { className: "absolute bg-white rounded-full opacity-40", style: {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: '1px',
                    height: '1px',
                    animation: `twinkle ${2 + Math.random() * 4}s infinite alternate`
                } }, `medium-${i}`)), [...Array(60)].map((_, i) => _jsx("div", { className: "absolute bg-white rounded-full opacity-20", style: {
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: '1px',
                    height: '1px',
                    animation: `twinkle ${3 + Math.random() * 5}s infinite alternate`
                } }, `small-${i}`)), _jsx("style", { children: `
        @keyframes twinkle {
          0% {
            opacity: 0.1;
          }
          100% {
            opacity: 0.7;
          }
        }
      ` })] });
}
export default StarBackground;
