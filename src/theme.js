import { amber, deepOrange, grey } from "@mui/material/colors";

const darkBlue = {
  100: "#ceccd2",
  200: "#9e99a5",
  300: "#6d6679",
  400: "#3d334c",
  500: "#0c001f",
  600: "#0a0019",
  700: "#070013",
  800: "#05000c",
  900: "#020006",
};

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: amber[500],
          },
          secondary: {
            main: deepOrange[900],
          },
          background: {
            default: grey[100],
          },
        }
      : {
          primary: {
            main: "#ff5722",
          },
          secondary: {
            main: "#22cbff",
          },
          background: {
            default: "#080112",
            paper: "#080112",
          },
        }),
  },
});