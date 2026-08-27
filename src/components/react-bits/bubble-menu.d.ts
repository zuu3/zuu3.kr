import type { ComponentType, ReactNode, CSSProperties } from "react";

export interface BubbleMenuItem {
  label: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
  onClick?: () => void;
}

export interface BubbleMenuProps {
  logo?: ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

declare const BubbleMenu: ComponentType<BubbleMenuProps>;
export default BubbleMenu;
