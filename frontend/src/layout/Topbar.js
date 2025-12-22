import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Topbar = () => {
  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1E293B" }}>
      <Toolbar>
        <Typography variant="h6">
          Sales Information System
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2">Admin</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
