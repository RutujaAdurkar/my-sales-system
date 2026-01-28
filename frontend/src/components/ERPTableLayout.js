import {
  Box,
  Typography,
  Button,
  Paper,
  InputBase
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function ERPTableLayout({
  title,
  search,
  setSearch,
  rightButtons,
  children
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      {/* ===== TITLE ===== */}
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 700,
          color: "#0d47a1",
          mb: 2
        }}
      >
        {title}
      </Typography>

      {/* ===== SEARCH + ACTIONS ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* SEARCH */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: 300,
            border: "1px solid #cfd8dc",
            borderRadius: 1,
            px: 2,
            height: 40
          }}
        >
          <SearchIcon sx={{ mr: 1, color: "#607d8b" }} />
          <InputBase
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />
        </Box>

        {/* RIGHT BUTTONS */}
        <Box display="flex" gap={2}>
          {rightButtons}
        </Box>
      </Box>

      {/* ===== TABLE CONTENT ===== */}
      {children}
    </Paper>
  );
}
