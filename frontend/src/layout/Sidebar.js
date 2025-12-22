import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Box
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import PointOfSaleOutlined from "@mui/icons-material/PointOfSaleOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import BuildOutlined from "@mui/icons-material/BuildOutlined";
import StoreOutlined from "@mui/icons-material/StoreOutlined";
import AccountBalanceOutlined from "@mui/icons-material/AccountBalanceOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";

const menuItems = [
  { text: "Sales", icon: <PointOfSaleOutlined /> },
  { text: "Purchase", icon: <ShoppingCartOutlined /> },
  { text: "Job Work", icon: <BuildOutlined /> },
  { text: "Store", icon: <StoreOutlined /> },
  { text: "Accounts", icon: <AccountBalanceOutlined /> },
  { text: "Utility", icon: <SettingsOutlined /> },
  { text: "Exit", icon: <LogoutOutlined /> }
];

const Sidebar = ({ open, toggle }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 220 : 70,
        "& .MuiDrawer-paper": {
          width: open ? 220 : 70,
          bgcolor: "#2E2E2E",
          color: "white",
          overflowX: "hidden",
          transition: "width 0.3s"
        }
      }}
    >
      {/* Toggle Button */}
      <Box sx={{ display: "flex", justifyContent: open ? "flex-end" : "center", p: 1 }}>
        <IconButton onClick={toggle} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <Tooltip title={!open ? item.text : ""} placement="right" key={index}>
            <ListItem
              button
              sx={{
                px: open ? 2 : 1,
                justifyContent: open ? "flex-start" : "center",
                "&:hover": { bgcolor: "#424242" }
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: open ? 40 : 0 }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
