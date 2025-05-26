import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useDesignSystem } from './DesignSystemProvider';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Quantum button component
 */
const QuantumButton = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, fullWidth = false, onClick, className = '', type = 'button', icon, iconPosition = 'left', quantumEffect = true, }) => {
    // Get theme from design system
    const { theme, isDarkMode } = useDesignSystem();
    const audio = useAudio();
    // Handle click
    const handleClick = (e) => {
        if (disabled || loading)
            return;
        audio.play('click', { volume: 0.3 });
        if (onClick) {
            onClick(e);
        }
    };
    // Get variant styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return `bg-${theme.colors.primary} hover:bg-opacity-90 text-white`;
            case 'secondary':
                return `bg-${theme.colors.secondary} hover:bg-opacity-90 text-white`;
            case 'accent':
                return `bg-${theme.colors.accent} hover:bg-opacity-90 text-white`;
            case 'ghost':
                return `bg-transparent hover:bg-gray-700 hover:bg-opacity-20 text-${theme.colors.text}`;
            default:
                return `bg-${theme.colors.primary} hover:bg-opacity-90 text-white`;
        }
    };
    // Get size styles
    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-1 text-sm';
            case 'md':
                return 'px-4 py-2 text-base';
            case 'lg':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-4 py-2 text-base';
        }
    };
    // Quantum effect variants
    const quantumVariants = {
        hover: {
            boxShadow: [
                `0 0 0 rgba(${isDarkMode ? '0, 200, 255' : '0, 100, 255'}, 0)`,
                `0 0 8px rgba(${isDarkMode ? '0, 200, 255' : '0, 100, 255'}, 0.5)`,
                `0 0 16px rgba(${isDarkMode ? '0, 200, 255' : '0, 100, 255'}, 0.3)`,
                `0 0 8px rgba(${isDarkMode ? '0, 200, 255' : '0, 100, 255'}, 0.5)`,
                `0 0 0 rgba(${isDarkMode ? '0, 200, 255' : '0, 100, 255'}, 0)`,
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
            },
        },
    };
    return (_jsx(motion.button, { type: type, disabled: disabled || loading, onClick: handleClick, className: `
        rounded-md font-medium transition-colors
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `, whileTap: { scale: disabled || loading ? 1 : 0.98 }, whileHover: quantumEffect && !disabled && !loading ? 'hover' : undefined, variants: quantumVariants, children: loading ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "w-5 h-5 mr-2 animate-spin", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "Loading..."] })) : (_jsxs("div", { className: "flex items-center justify-center", children: [icon && iconPosition === 'left' && _jsx("span", { className: "mr-2", children: icon }), children, icon && iconPosition === 'right' && _jsx("span", { className: "ml-2", children: icon })] })) }));
};
export default QuantumButton;
