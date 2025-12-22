// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemText,
//   ListItemIcon,
//   Collapse,
//   Divider,
//   Tooltip,
// } from "@mui/material";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import {
//   PointOfSaleOutlined,
//   ShoppingCartOutlined,
//   BuildOutlined,
//   StoreOutlined,
//   AccountBalanceOutlined,
//   ReportProblemOutlined,
//   UploadFileOutlined,
//   AssessmentOutlined,
//   SettingsOutlined,
//   LogoutOutlined,
//   DashboardOutlined,
// } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// /* drawer widths */
// const DRAWER_WIDTH = 280;
// const MINI_WIDTH = 72;

// /* SAME DIVIDER CONFIG */
// const SUBMENU_DIVIDERS = {
//   1: [9, 14],
//   2: [17],
//   3: [8],
//   4: [3],
//   5: [3],
//   6: [9, 14, 22],
//   10: [1, 7],
//   194: [6, 8, 10],
// };

// /* ICON MAP */
// const iconMap = {
//   "Sales Information System": <DashboardOutlined />,
//   Sales: <PointOfSaleOutlined />,
//   Purchase: <ShoppingCartOutlined />,
//   "Job Work": <BuildOutlined />,
//   Store: <StoreOutlined />,
//   Accounts: <AccountBalanceOutlined />,
//   "Faulty/Warranty Units": <ReportProblemOutlined />,
//   "Export (XML/ASCII)": <UploadFileOutlined />,
//   MIS: <AssessmentOutlined />,
//   Utility: <SettingsOutlined />,
//   Exit: <LogoutOutlined />,
// };

// const MenuDrawer = ({ open }) => {
//   const [menuData, setMenuData] = useState([]);
//   const [openItems, setOpenItems] = useState({});
//   const navigate = useNavigate();

//   /* FETCH MENU */
//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/emp")
//       .then((res) => setMenuData(buildTree(res.data)))
//       .catch((err) => console.log(err));
//   }, []);

//   const buildTree = (list) => {
//     const map = {};
//     const roots = [];

//     list.forEach(
//       (item) => (map[item.MenuID] = { ...item, children: [] })
//     );

//     list.forEach((item) =>
//       item.ParentID === null
//         ? roots.push(map[item.MenuID])
//         : map[item.ParentID]?.children.push(map[item.MenuID])
//     );

//     return roots;
//   };

//   const toggle = (id) =>
//     setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));

//   const handleNavigation = (menuName) => {
//   if (menuName === "Item Master Entry") {
//     navigate("/item-master");

//     if (menuName === "Application Report Entry") 
//     navigate("/application-report");

//   } else if (menuName === "Exit") {
//     navigate("/");
//   }

//   //setOpen(false); // ✅ collapse drawer after navigation
// };

//   const renderMenu = (items, isSubMenu = false, parentMenuId = null) =>
//     items.map((item, index) => (
//       <div key={item.MenuID}>
//         {isSubMenu &&
//           SUBMENU_DIVIDERS[parentMenuId]?.includes(index) && (
//              <Divider
//               sx={{
//                 my: 1,
//                 borderColor: "#222",
//                 opacity: 1,
//                 borderBottomWidth: 1,
//               }}
//             />
//           )}

//         <Tooltip title={!open ? item.MenuName : ""} placement="right">
//           <ListItemButton
//              onClick={() =>
//              item.children.length
//              ? toggle(item.MenuID)
//              : handleNavigation(item.MenuName)
//             }
//             sx={{
//                pl: isSubMenu ? 4 : 2,
//                justifyContent: open ? "flex-start" : "center",
//             }}
//           >
//         {/* ICON (always visible) */}
//           {!isSubMenu && (
//             <ListItemIcon
//                sx={(theme) => ({
//                color: theme.palette.text.primary,
//                minWidth: open ? 40 : "auto",
//                justifyContent: "center",
//               })}
//             >
//             {iconMap[item.MenuName] || <DashboardOutlined />}
//             </ListItemIcon>
//           )}


//             {/* TEXT (only when drawer open) */}
//              {open && <ListItemText primary={item.MenuName} />}

//             {/* EXPAND ICON */}
//             {item.children.length > 0 &&
//              open &&
//              (openItems[item.MenuID] ? <ExpandLess /> : <ExpandMore />)}
//          </ListItemButton>
//        </Tooltip>

//         {item.children.length > 0 && (
//           <Collapse in={openItems[item.MenuID]} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {renderMenu(item.children, true, item.MenuID)}
//             </List>
//           </Collapse>
//         )}
//       </div>
//     ));

//   return (
//     <Drawer
//   variant="permanent"
//   sx={{
//     width: open ? DRAWER_WIDTH : MINI_WIDTH,
//     "& .MuiDrawer-paper": {
//       width: open ? DRAWER_WIDTH : MINI_WIDTH,
//       top: 64,                    // ✅ PUSH BELOW APPBAR
//       height: "calc(100% - 64px)",
//       overflowX: "hidden",
//       transition: "width 0.3s ease",
//       bgcolor: (theme) => theme.palette.background.paper,
//     },
//   }}
// >
//       <List>{renderMenu(menuData)}</List>
//     </Drawer>
//   );
// };

// export default MenuDrawer;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Divider,
  Tooltip,
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

  const navigate = useNavigate();

  /* FETCH MENU */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/emp")
      .then((res) => setMenuData(buildTree(res.data)))
      .catch((err) => console.log(err));
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

    if (menuName === "Item Master Entry") {
      navigate("/item-master");
    }

    if (menuName === "Application Report Entry") {
      navigate("/application-report");
    }

    if (menuName === "Payment Follow-up Entry") {    // ⭐ add this
    navigate("/payment-followup");
  }

    if (menuName === "Exit") {
      navigate("/");
    }

    setOpen(false);
  };


  const renderMenu = (items, isSubMenu = false, parentMenuId = null) =>
    items.map((item, index) => (
      <div key={item.MenuID}>

        {isSubMenu &&
          SUBMENU_DIVIDERS[parentMenuId]?.includes(index) && (
            <Divider
              sx={{
                my: 1,
                borderColor: "#222",
                opacity: 1,
                borderBottomWidth: 1,
              }}
            />
          )}

        <Tooltip title={!open ? item.MenuName : ""} placement="right">
          <ListItemButton
            onClick={() =>
              item.children.length
                ? toggle(item.MenuID)
                : handleNavigation(item.MenuName)
            }
            sx={{
              pl: isSubMenu ? 4 : 2,
              justifyContent: open ? "flex-start" : "center",
            }}
          >

            {/* show icons ONLY for main menus */}
            {!isSubMenu && (
              <ListItemIcon
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  minWidth: open ? 40 : "auto",
                  justifyContent: "center",
                })}
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


        {item.children.length > 0 && (
          <Collapse in={openItems[item.MenuID]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderMenu(item.children, true, item.MenuID)}
            </List>
          </Collapse>
        )}
      </div>
    ));


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : MINI_WIDTH,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : MINI_WIDTH,
          top: 64,
          height: "calc(100% - 64px)",
          overflowX: "hidden",
          transition: "width 0.3s ease",
          bgcolor: (theme) => theme.palette.background.paper,
        },
      }}
    >
      <List>{renderMenu(menuData)}</List>
    </Drawer>
  );
};

export default MenuDrawer;
