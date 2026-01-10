import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

import DashboardLayout from "./layout/DashboardLayout";
import ItemForm from "./pages/ItemForm";
import ItemMasterList from "./pages/ItemMasterList";
import ApplicationReportForm from "./pages/ApplicationReportForm";
import ProjectFollowUpForm from "./pages/ProjectFollowUpForm";
import CityMasterForm from "./pages/CityMasterForm";
import StateMasterForm from "./pages/StateMasterForm";

function App() {
  // 🔹 Drawer state (unchanged)
  const [drawerOpen, setDrawerOpen] = useState(false); 
// false = icon only, true = icon + text


  // 🔹 Theme mode state (unchanged)
  const [mode, setMode] = useState(
    localStorage.getItem("appTheme") || "light"
  );

  // 🔹 Theme creation (unchanged logic)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiOutlinedInput: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
              }),
            },
          },
          MuiFilledInput: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
              }),
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
              }),
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: theme.palette.background.paper,
              }),
            },
          },
        },
      }),
    [mode]
  );

  // 🔹 Theme toggle (unchanged)
  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("appTheme", next);
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Router>
        {/* 🔹 TOP APP BAR (UNCHANGED FUNCTIONALITY) */}
       
        <AppBar
  position="fixed"
  sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
>
          <Toolbar sx={{ minHeight: 64 }}>
            <IconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => setDrawerOpen(prev => !prev)}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
              Dashboard
            </Typography>

            <IconButton color="inherit" onClick={toggleMode}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 🔹 MAIN DASHBOARD LAYOUT */}
        <DashboardLayout
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        >
          {/* 🔹 CONTENT AREA */}
          <Box
            sx={{
              minHeight: "100vh",
              bgcolor: "background.default",
              paddingTop: "80px", // space for AppBar
              px: 3,
            }}
          >
            <Routes>
              {/* HOME */}
              <Route
                path="/"
                element={<Typography variant="h4">Welcome</Typography>}
              />

              {/* ITEM MASTER LIST */}
              <Route path="/item-master" element={<ItemMasterList />} />

              {/* ADD ITEM */}
              <Route path="/itemform" element={<ItemForm />} />

              {/* EDIT ITEM */}
              <Route path="/itemform/:id" element={<ItemForm />} />
             
              {/* APPLICATION REPORT FORM */}
               <Route path="/application-report" element={<ApplicationReportForm />} />

              {/* PROJECT FOLLOW-UP FORM */}
               <Route path="/project-followup" element={<ProjectFollowUpForm />} />
              
              {/* CITY MASTER FORM */}
              <Route path="/city-master" element={<CityMasterForm />} />
              
              {/* STATE MASTER FORM */}
              <Route path="/state-master" element={<StateMasterForm />} />
            
            </Routes>
          </Box>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
