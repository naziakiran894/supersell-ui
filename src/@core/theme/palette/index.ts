// ** Type Imports
import { Palette } from "@mui/material";
import { Skin, ThemeColor } from "../../layouts/types";

const DefaultPalette = (
  mode: Palette["mode"],
  skin: Skin,
  themeColor: ThemeColor
): Palette => {
  // ** Vars
  const whiteColor = "#FFF";
  const lightColor = "58, 53, 65";
  const darkColor = "231, 227, 252";
  const mainColor = mode === "light" ? lightColor : darkColor;

  const primaryGradient = () => {
    if (themeColor === "primary") {
      return "#C6A7FE";
    } else if (themeColor === "secondary") {
      return "#9C9FA4";
    } else if (themeColor === "success") {
      return "#56CA00";
    } else if (themeColor === "error") {
      return "#FF4C51";
    } else if (themeColor === "warning") {
      return "#FFCF5C";
    } else {
      return "#fffff";
    }
  };

  const defaultBgColor = () => {
    if (skin === "bordered" && mode === "light") {
      return whiteColor;
    } else if (skin === "bordered" && mode === "dark") {
      return "#312D4B";
    } else if (mode === "light") {
      return "#F4F5FA";
    } else return "#28243D";
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      primaryGradient: primaryGradient(),
      bodyBg: mode === "light" ? "#F4F5FA" : "#28243D", // Same as palette.background.default but doesn't consider bordered skin
      trackBg: mode === "light" ? "#F0F2F8" : "#474360",
      avatarBg: mode === "light" ? "#F0EFF0" : "#3F3B59",
      darkBg: skin === "bordered" ? "#312D4B" : "#28243D",
      lightBg: skin === "bordered" ? whiteColor : "#F4F5FA",
      tableHeaderBg: mode === "light" ? "#F9FAFC" : "#3D3759",
    },
    mode: mode,
    common: {
      black: "#000",
      white: whiteColor,
    },
    primary: {
      light: "#56CA00",
      main: "#9155FD",
      dark: "#4D5056",

      // "#804BDF",
      contrastText: whiteColor,
    },
    secondary: {
      light: "#9C9FA4",
      main: "#8A8D93",
      dark: "#9155FD",
      // "#777B82",
      contrastText: whiteColor,
    },
    error: {
      light: "#FF7043",
      // #FF4C51",
      main: "#FF4C51",
      dark: "#139CE0",
      // "#E04347",
      contrastText: whiteColor,
    },
    warning: {
      light: "#FCD116",
      //  "#FFCA64",
      main: "#FFB400",
      dark: "#E09E00",
      // "#E09E00",
      contrastText: whiteColor,
    },
    info: {
      light: "#32BAFF",
      main: "#16B1FF",
      dark: "#4CB200",
      // "#139CE0",
      contrastText: whiteColor,
    },
    success: {
      light: "#6AD01F",
      main: "#56CA00",
      dark: "#4CB200",
      contrastText: whiteColor,
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#F5F5F5",
      A200: "#EEEEEE",
      A400: "#BDBDBD",
      A700: "#616161",
    },
    text: {
      primary: `rgba(${mainColor}, 0.87)`,
      secondary: `rgba(${mainColor}, 0.6)`,
      disabled: `rgba(${mainColor}, 0.38)`,
    },
    divider: `rgba(${mainColor}, 0.12)`,
    background: {
      paper: mode === "light" ? whiteColor : "#312D4B",
      default: defaultBgColor(),
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.04)`,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  } as Palette;
};

export default DefaultPalette;
