import type React from "react";
import { SHOP_INFO } from "../../constants/shopInfo";

interface LogoProps {
  layout?: "horizontal" | "vertical";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  subtitleClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  layout = "horizontal",
  className = "",
  iconClassName = "",
  textClassName = "",
  subtitleClassName = "",
}) => {
  const isVertical = layout === "vertical";
  const [firstPart, ...restParts] = SHOP_INFO.name.split(" ");
  const restText = restParts.join(" ");

  // Shared Emblem (SVG flower + monogram)
  const renderEmblem = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-all duration-300 ${
        isVertical ? "w-16 h-16 mb-3" : "w-12 h-12"
      } ${iconClassName}`}
    >
      {/* 8 Sweeping Petals (Rotated Around Center 50, 50) */}
      <g stroke="currentColor">
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(0, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(45, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(90, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(135, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(180, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(225, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(270, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 C 65 16, 76 30, 70 46 C 66 54, 55 50, 50 50"
          transform="rotate(315, 50, 50)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Monogram 'LF' */}
      <g stroke="currentColor">
        {/* Cursive L */}
        <path
          d="M 40 38 C 38 34, 42 30, 45 34 C 48 38, 43 48, 41 53 C 39 58, 35 62, 38 64 C 41 66, 48 62, 53 58"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cursive F */}
        <path
          d="M 43 44 C 47 44, 54 44, 58 40 C 61 37, 58 32, 53 32 C 48 32, 45 37, 47 43 C 49 49, 53 58, 51 63 C 49 68, 45 68, 44 65"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Crossbar of F */}
        <path
          d="M 46 49 C 50 49, 54 48, 57 47"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  return (
    <div
      className={`flex transition-all duration-300 ${
        isVertical
          ? "flex-col items-start text-left"
          : "flex-row items-center gap-3"
      } ${className}`}
    >
      {renderEmblem()}

      <div className="flex flex-col items-start">
        {/* Brand Text + Leaf */}
        <div className="flex items-baseline">
          <div className="relative inline-block">
            <span
              className={`font-playfair font-bold tracking-wide transition-colors duration-300 ${
                isVertical ? "text-3xl" : "text-2xl"
              } ${textClassName}`}
            >
              {firstPart}
            </span>
            {/* Leaf vector icon emerging from the 'r' */}
            <svg
              viewBox="0 0 100 100"
              fill="currentColor"
              className="absolute -top-1 -right-3.5 w-4 h-4 transform rotate-[25deg] text-[#829E8D]"
            >
              <path d="M10 80 C 30 50, 70 40, 90 20 C 70 45, 50 65, 10 80 Z" />
              <path
                d="M10 80 Q 50 50 90 20"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {restText && (
            <span
              className={`font-playfair font-bold tracking-wide transition-colors duration-300 ml-4 ${
                isVertical ? "text-3xl" : "text-2xl"
              } ${textClassName}`}
            >
              {restText}
            </span>
          )}
        </div>

        {/* Subtitle */}
        <span
          className={`font-sans text-[10px] uppercase tracking-[0.2em] font-medium leading-none mt-0.5 transition-colors duration-300 ${
            subtitleClassName ||
            (textClassName.includes("text-white")
              ? "text-white/60"
              : "text-[#829E8D]")
          }`}
        >
          Florist Jogja
        </span>
      </div>
    </div>
  );
};

export default Logo;
