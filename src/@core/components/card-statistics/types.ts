// ** Types
import { ReactNode } from "react";
import { ThemeColor } from "../../../@core/layouts/types";

export type CardStatsHorizontalProps = {
  title: string;
  stats: string;
  icon: string;
  color?: ThemeColor;
  number: string;
  trendNumber: string;
  trend: "positive" | "negative";
};

export type CardStatsVerticalProps = {
  title: string;
  stats: string;
  icon: string | ReactNode;
  bgColor: string;
  color?: ThemeColor;
  number: string;
  optionsMenuProps?: any;
  subtitle: string;
  trendNumber: string;
  trend: "positive" | "negative";
};

export type CardStatsCharacterProps = {
  title: string;
  stats: string;
  number?: string;
  trendNumber: string;
  bgColor?: string;
  icon?: string;
  trend?: "positive" | "negative";
  chipText: string;
  src: string;
  chipColor: any;
};
export type CardStatsProps = {
  title: string;
  icon: string;
  stats: string;
  bgColor: string;
  isReverted?: boolean;
};
