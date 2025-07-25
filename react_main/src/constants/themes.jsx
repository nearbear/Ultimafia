import React from "react";
import { createTheme } from "@mui/material";
import { Box } from "@mui/material";

import surprised from "images/emotes/surprised.webp";
import sad from "images/emotes/sad.webp";

const currentMonth = new Date().getMonth();
const isHalloween = currentMonth === 9;

const CustomExpandIcon = () => {
  return (
    <Box
      sx={{
        ".Mui-expanded & > .collapsIconWrapper": {
          display: "none",
        },
        ".expandIconWrapper": {
          display: "none",
        },
        ".Mui-expanded & > .expandIconWrapper": {
          display: "block",
        },
      }}
    >
      <div className="expandIconWrapper">
        <img src={surprised} />
      </div>
      <div className="collapsIconWrapper">
        <img src={sad} />
      </div>
    </Box>
  );
};

export const darkTheme = createTheme({
  components: {
    MuiAccordion: {
      defaultProps: {
        defaultExpanded: true,
      },
    },
    MuiAccordionSummary: {
      defaultProps: {
        expandIcon: <CustomExpandIcon />,
      },
      styleOverrides: {
        expandIconWrapper: {
          transition: "none",
          "&.Mui-expanded": {
            transform: "none",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
        sx: { textTransform: "none" },
        disableRipple: true,
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#D4A017",
          opacity: 0.8,
          "&:hover": {
            opacity: 1,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiTable: {
      minWidth: 650,
      size: "small",
    },
    MuiTableCell: {
      align: "center",
      fontWeight: "bold",
    },
  },
  typography: {
    fontFamily: ["RobotoSlab"].join(","),
    color: "#F1F1F1",
  },
  palette: {
    mode: "dark",
    primary: {
      main: isHalloween ? "#FF8C00" : "#AC2222",
    },
    secondary: {
      main: isHalloween ? "#FF8C00" : "#D42A2A",
    },
    info: {
      main: "#DAA520",
    },
    text: {
      main: "#F1F1F1", // Text color remains the same
    },
  },
});

export const lightTheme = createTheme({
  ...darkTheme,
  palette: {
    ...darkTheme?.palette,
    mode: "dark",
  },
});

export const darkThemeHigherContrast = createTheme({
  ...darkTheme,
  palette: {
    ...darkTheme?.palette,
    mode: "dark",
    primary: {
      main: "#EA0F0B", // EA0F0B, F63F3C, F97876
    },
  },
});

export const dialogTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F41410",
      // main: "#F98280", /* lighter version */
    },
  },
  typography: {
    fontFamily: ["RobotoSlab"].join(","),
  },
});
