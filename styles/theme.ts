import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      dark: "#583ea8",
      main: "#7f5af0",
      light: "#987bf3",
    },
    secondary: {
      dark: "#1e7f57",
      main: "#2cb67d",
      light: "#56c497",
    },
  },
  props: {
    MuiTypography: {
      color: "textPrimary",
    },
    MuiToolbar: {
      variant: "dense",
    },
  },
});
