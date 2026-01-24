// import React, { useState, useMemo } from "react";
import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/orange-theme.css";
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
import SalesReturn from "./pages/SalesReturn";
import WildCardSearch from "./pages/WildCardSearch";
import VisitReportCustomerwise from "./pages/VisitReportCustomerwise";
import FollowupTelephoneReportCustomerwise from "./pages/FollowupTelephoneReportCustomerwise";
import TechnicalSupportReportCustomerwise from "./pages/TechnicalSupportReportCustomerwise";
import VideoSalesCallReportCustomerwise from "./pages/VideoSalesCallReportCustomerwise";
import PaymentFollowupReport from "./pages/PaymentFollowupReport";

function App() {
  // 🔹 Drawer state (unchanged)
  const [drawerOpen, setDrawerOpen] = useState(false); 
// false = icon only, true = icon + text


  // 🔹 Theme mode state (unchanged)
  const [mode, setMode] = useState(
    localStorage.getItem("appTheme") || "light"
  );

  // 🔹 Theme creation (unchanged logic)
  // const theme = useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         mode,
  //       },
  //       components: {
  //         MuiOutlinedInput: {
  //           styleOverrides: {
  //             root: ({ theme }) => ({
  //               backgroundColor: theme.palette.background.paper,
  //             }),
  //           },
  //         },
  //         MuiFilledInput: {
  //           styleOverrides: {
  //             root: ({ theme }) => ({
  //               backgroundColor: theme.palette.background.paper,
  //             }),
  //           },
  //         },
  //         MuiInputBase: {
  //           styleOverrides: {
  //             root: ({ theme }) => ({
  //               backgroundColor: theme.palette.background.paper,
  //             }),
  //           },
  //         },
  //         MuiPaper: {
  //           styleOverrides: {
  //             root: ({ theme }) => ({
  //               backgroundColor: theme.palette.background.paper,
  //             }),
  //           },
  //         },
  //       },
  //     }),
  //   [mode]
  // );
  const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: "#2563eb", // BLUE
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

  // 🔹 Sync MUI theme mode with global CSS (VERY IMPORTANT)
useEffect(() => {
  if (mode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}, [mode]);


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
              paddingTop: "96px", // space for AppBar
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
            
              {/* SALES RETURN */}
               <Route path="/sales-return" element={<SalesReturn />} />
              
              {/* WILD CARD SEARCH */}
              <Route path="/wildcard-search" element={<WildCardSearch />} />
            
              
            {/* VISIT REPORT - CUSTOMERWISE */}
            <Route path="/visit-report-customerwise" element={<VisitReportCustomerwise />} />

            {/* FOLLOWUP TELEPHONE REPORT - CUSTOMERWISE */}
            <Route path="/followup-telephone-report-customerwise" element={<FollowupTelephoneReportCustomerwise />} />
            
            {/* TECHNICAL SUPPORT REPORT - CUSTOMERWISE */}
            <Route path="/technical-support-report-customerwise" element={<TechnicalSupportReportCustomerwise />} />


            {/* VIDEO SALES CALL REPORT - CUSTOMERWISE */}
            <Route path="/video-sales-call-report-customerwise" element={<VideoSalesCallReportCustomerwise />} />
            
            <Route
               path="/payment-follow-up-report"
               element={<PaymentFollowupReport />}
           />

            </Routes>
          </Box>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
