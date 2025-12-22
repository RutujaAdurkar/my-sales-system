import React from "react";
import { Box } from "@mui/material";
import MenuDrawer from "../MenuDrawer";

const DRAWER_WIDTH = 280;   // ✅ ADD
const MINI_WIDTH = 72;      // ✅ ADD

const DashboardLayout = ({ drawerOpen, setDrawerOpen, children }) => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      {/* Drawer */}
      <MenuDrawer open={drawerOpen} setOpen={setDrawerOpen} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "all 0.3s ease",
          marginLeft: drawerOpen
            ? `${DRAWER_WIDTH}px`
            : `${MINI_WIDTH}px`,
          width: drawerOpen
            ? `calc(100% - ${DRAWER_WIDTH}px)`
            : `calc(100% - ${MINI_WIDTH}px)`,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          bgcolor: "background.default",
        }}
      >
        {/* Content centered */}
        <Box sx={{ width: "100%", maxWidth: 1200 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
