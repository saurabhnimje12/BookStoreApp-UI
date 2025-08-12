import React, { useState, useEffect  } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Grid,
  Paper,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A"; 

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: { currentTarget: React.SetStateAction<null>; }) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUpComing = () => {
  navigate("/upcoming");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/signin");
  };

  const handleContinueShopping = () => {
    navigate("/home");
  };

  useEffect(() => {
  if (!location.state?.orderId) {
    navigate("/cart");
  }
}, [location.state, navigate]);

  return (
    <>
      {/* HEADER */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <MenuBookIcon sx={{ mr: 1, cursor: "pointer" }} onClick={() => navigate("/")} />
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
            Bookstore
          </Typography>

          <IconButton color="inherit" onClick={handleMenuClick}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleUpComing}>My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* BODY */}
      <Container maxWidth="md" sx={{ mt: 8, mb: 10 }}>
        <Box sx={{ textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "green" }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Placed Successfully
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Hurray!!! Your order is confirmed. <br />
            The order id is <strong>#{orderId}</strong>. Save it for future reference.
          </Typography>

          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" fontWeight="bold">Email us</Typography>
                    <Typography variant="body2">admin@bookstore.com</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" fontWeight="bold">Contact us</Typography>
                    <Typography variant="body2">+91 8163475881</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" fontWeight="bold">Address</Typography>
                    <Typography variant="body2">
                      42, 14th Main, 15th Cross, Sector 4, <br />
                      Opp. to BDA complex, near Kumarakom restaurant, <br />
                      HSR Layout, Bangalore 560034
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          <Button variant="contained" color="primary" onClick={handleContinueShopping} sx={{ mt: 4 }}>
            CONTINUE SHOPPING
          </Button>
        </Box>
      </Container>

      {/* FOOTER */}
      <Box component="footer" sx={{ py: 3, textAlign: "center", bgcolor: "grey.200", mt: "auto" }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Online Bookstore. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default OrderSuccess;
