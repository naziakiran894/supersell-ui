// ** MUI Imports
import Box from "@mui/material/Box";

// ** Type Import
import { LayoutProps } from "../../../types";

// ** Config Import
import themeConfig from "../../../../../configs/themeConfig";

// ** Menu Components

interface Props {
  settings: LayoutProps["settings"];
  horizontalNavItems: NonNullable<
    NonNullable<LayoutProps["horizontalLayoutProps"]>["navMenu"]
  >["navItems"];
}

const Navigation = (props: Props) => {
  return (
    <Box
      className="menu-content"
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        "& > *": {
          "&:not(:last-child)": { mr: 2 },
          ...(themeConfig.menuTextTruncate && { maxWidth: 220 }),
        },
      }}
    >
    </Box>
  );
};

export default Navigation;
