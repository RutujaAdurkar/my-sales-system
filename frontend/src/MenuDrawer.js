import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MenuDrawer.css";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Tooltip,
  Box, // ✅ FIX 1: REQUIRED
} from "@mui/material";

import { ExpandLess, ExpandMore } from "@mui/icons-material";

import {
  PointOfSaleOutlined,
  ShoppingCartOutlined,
  BuildOutlined,
  StoreOutlined,
  AccountBalanceOutlined,
  ReportProblemOutlined,
  UploadFileOutlined,
  AssessmentOutlined,
  SettingsOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

/* drawer widths */
const DRAWER_WIDTH = 280;
const MINI_WIDTH = 72;

/* SAME DIVIDER CONFIG */
const SUBMENU_DIVIDERS = {
  1: [9, 14],
  2: [17],
  3: [8],
  4: [3],
  5: [3],
  6: [9, 14, 22],
  10: [1, 7],
  194: [6, 8, 10],
};

/* ICON MAP */
const iconMap = {
  "Sales Information System": <DashboardOutlined />,
  Sales: <PointOfSaleOutlined />,
  Purchase: <ShoppingCartOutlined />,
  "Job Work": <BuildOutlined />,
  Store: <StoreOutlined />,
  Accounts: <AccountBalanceOutlined />,
  "Faulty/Warranty Units": <ReportProblemOutlined />,
  "Export (XML/ASCII)": <UploadFileOutlined />,
  MIS: <AssessmentOutlined />,
  Utility: <SettingsOutlined />,
  Exit: <LogoutOutlined />,
};

const MenuDrawer = ({ open, setOpen }) => {
  const [menuData, setMenuData] = useState([]);
  const [openItems, setOpenItems] = useState({});

  // 🔹 Floating submenu state
  const [floatingMenu, setFloatingMenu] = useState(null);
  const [floatingAnchor, setFloatingAnchor] = useState(null);

  const navigate = useNavigate();

  /* FETCH MENU */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/emp")
      .then((res) => setMenuData(buildTree(res.data)))
      .catch(console.log);
  }, []);

  const buildTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach(
      (item) => (map[item.MenuID] = { ...item, children: [] })
    );

    list.forEach((item) =>
      item.ParentID === null
        ? roots.push(map[item.MenuID])
        : map[item.ParentID]?.children.push(map[item.MenuID])
    );

    return roots;
  };

  const toggle = (id) =>
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));

  /* ⭐ FIXED NAVIGATION */
  const handleNavigation = (menuName) => {
  const name = menuName.toLowerCase().trim();

  if (name === "item master entry") navigate("/item-master");
  else if (name === "application report entry") navigate("/application-report");
  else if (name === "project follow-up entry") navigate("/project-followup");
  else if (name === "city master") navigate("/city-master");
  else if (name === "state master") navigate("/state-master");
  else if (name === "sales return") navigate("/sales-return");
  else if (name === "wildcard search" || name === "wild card search")
    navigate("/wildcard-search");
 else if (name.includes("visit report") && name.includes("customer"))
  navigate("/visit-report-customerwise");
else if (name.includes("technical") &&
    name.includes("support") &&
    name.includes("customer")
  )
    navigate("/technical-support-report-customerwise");

  else if (name.includes("video") &&
    name.includes("sales") &&
    name.includes("customer")
  )
    navigate("/video-sales-call-report-customerwise");

 else if (
    name.includes("followup") &&
    name.includes("telephone") &&
    name.includes("customer")
  )
    navigate("/followup-telephone-report-customerwise");

    else if (
    name.includes("payment") &&
    name.includes("follow") &&
    name.includes("report")
  )
    navigate("/payment-follow-up-report");
  
  else if (name === "exit") navigate("/");
  setFloatingMenu(null);
  setOpen(false);
};

  const renderFloatingTree = (items) => (
  <List dense>
    {items.map((item) => (
      <React.Fragment key={item.MenuID}>
        <ListItemButton
          onClick={() => {
            handleNavigation(item.MenuName);
           }}

          sx={{ pl: 2 }}
        >
          <ListItemText primary={item.MenuName} />
        </ListItemButton>

        {/* 🔽 SUB-SUB MENUS */}
        {item.children?.length > 0 && (
          <Box sx={{ pl: 2 }}>
            {renderFloatingTree(item.children)}
          </Box>
        )}
      </React.Fragment>
    ))}
  </List>
);

  const renderMenu = (items, isSubMenu = false, parentMenuId = null) =>
    items.map((item, index) => (
      <div key={item.MenuID}>
        {isSubMenu &&
          SUBMENU_DIVIDERS[parentMenuId]?.includes(index) && (
            <Divider className="menu-divider" />
          )}

        <Tooltip title={!open ? item.MenuName : ""} placement="right">
          <ListItemButton
            onClick={(e) => {
  // 🔹 COLLAPSED → OPEN FLOATING FULL MENU
  if (!open && item.children.length > 0) {
    setFloatingMenu(item);
    setFloatingAnchor(e.currentTarget);
    return;
  }

  // 🔹 EXPANDED → NORMAL BEHAVIOR
  if (open && item.children.length > 0) {
    toggle(item.MenuID);
    return;
  }

  handleNavigation(item.MenuName);
}}

            className={
              isSubMenu
                ? "menu-item submenu-item"
                : open
                ? "menu-item"
                : "menu-item menu-item-collapsed"
            }
          >
            {!isSubMenu && (
              <ListItemIcon
                className={
                  open ? "menu-icon" : "menu-icon menu-icon-collapsed"
                }
              >
                {iconMap[item.MenuName] || <DashboardOutlined />}
              </ListItemIcon>
            )}

            {open && <ListItemText primary={item.MenuName} />}

            {item.children.length > 0 &&
              open &&
              (openItems[item.MenuID] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </Tooltip>

        {/* NORMAL COLLAPSE (ONLY WHEN OPEN) */}
        {open && item.children.length > 0 && (
          <Collapse in={openItems[item.MenuID]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderMenu(item.children, true, item.MenuID)}
            </List>
          </Collapse>
        )}
      </div>
    ));

  return (
    <>
      {!open && floatingMenu && floatingAnchor && (
  <Box
    sx={{
      position: "fixed",
      top: floatingAnchor.getBoundingClientRect().top,
      left: MINI_WIDTH + 12,
      width: 320,
      maxHeight: "75vh",
      overflowY: "auto",
      bgcolor: "background.paper",
      boxShadow: 8,
      borderRadius: 2,
      zIndex: 5000,
      p: 1,
    }}
    onMouseLeave={() => setFloatingMenu(null)}
  >
    {renderFloatingTree(floatingMenu.children)}
  </Box>
)}


      {/* 🔹 MAIN DRAWER */}
      <Drawer
        variant="permanent"
        PaperProps={{
          className: `menu-drawer-paper ${
            open ? "expanded" : "collapsed"
          }`,
        }}
        sx={{
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_WIDTH : MINI_WIDTH,
            transition: "width 0.3s ease",
            top: 64,
            height: "calc(100% - 64px)",
            overflowX: "hidden",
          },
        }}
      >
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>
          {renderMenu(menuData)}
        </List>
      </Drawer>
    </>
  );
};

export default MenuDrawer;
