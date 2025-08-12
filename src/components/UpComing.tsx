import React from "react";
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useNavigate } from "react-router-dom";

const Upcoming = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <MenuBookIcon
            sx={{ mr: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ flex: 1, mt: 8, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "black" }}
        >
          This Page is coming Soon
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          We’re working on something exciting. Stay tuned for updates!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/home")}
        >
          Back to Home
        </Button>
      </Container>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          bgcolor: "grey.200",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Online Bookstore. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Upcoming;
