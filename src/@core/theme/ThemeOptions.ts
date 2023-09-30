import { deepmerge } from "@mui/utils";
import { PaletteMode, ThemeOptions } from "@mui/material";
import { Settings } from "../context/settingsContext";

import palette from "./palette";
import spacing from "./spacing";
import shadows from "./shadows";
import typography from "./typography";
import breakpoints from "./breakpoints";

const themeOptions = (
  settings: Settings,
  overrideMode: PaletteMode
): ThemeOptions => {
  const { skin, mode, themeColor } = settings;

  const userThemeConfig: ThemeOptions = Object.assign({});

  const mergedThemeConfig: ThemeOptions = deepmerge(
    {
      breakpoints: breakpoints(),

      palette: palette(
        mode === "semi-dark" ? overrideMode : mode,
        skin,
        themeColor
      ),
      ...spacing,
      shape: {
        borderRadius: 6,
      },
      mixins: {
        toolbar: {
          minHeight: 64,
        },
      },
      shadows: shadows(mode === "semi-dark" ? overrideMode : mode),
      typography,
    },
    userThemeConfig
  );

  return deepmerge(mergedThemeConfig, {
    palette: {
      primary: {
        ...(mergedThemeConfig.palette
          ? mergedThemeConfig.palette[themeColor]
          : palette(
              mode === "semi-dark" ? overrideMode : mode,
              skin,
              themeColor
            ).primary),
      },
    },
  });
};

export default themeOptions;
