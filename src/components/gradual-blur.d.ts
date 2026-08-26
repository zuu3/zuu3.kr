import type { ComponentType, CSSProperties } from "react";

export interface GradualBlurProps {
  position?: "top" | "bottom" | "left" | "right";
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  curve?: "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";
  opacity?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  hoverIntensity?: number;
  target?: "parent" | "page";
  preset?: "top" | "bottom" | "left" | "right" | "subtle" | "intense" | "smooth" | "sharp" | "header" | "footer" | "sidebar" | "page-header" | "page-footer";
  responsive?: boolean;
  zIndex?: number;
  onAnimationComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}

declare const GradualBlur: ComponentType<GradualBlurProps>;
export default GradualBlur;
