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

/**
 * OrderSuccess component
 * Displays a success message after an order is placed.
 * Includes navigation options for the user to view their profile or logout.
 * Provides contact information and a button to continue shopping.
 * This component is part of an online bookstore application.
 * It is displayed after a user successfully places an order.
 * It includes a header with navigation options, a success message,
 * contact information, and a button to continue shopping.
 * The component also handles user interactions such as navigating to the profile page,
 * logging out, and continuing to shop.
 */



/**
 * OrderSuccess component displays a success message after an order is placed.
 * It includes navigation options for the user to view their profile or logout.
 * The component also provides contact information and a button to continue shopping.
 */
const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A"; 

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  /**
   * Function to handle menu click
   * It sets the anchor element to the current target, opening the menu
   * @param {Object} event - The event object containing the current target
   * @returns {void}
   * @description This function is triggered when the user clicks on the account icon.
   * It opens a menu with options for profile and logout.
   */
  const handleMenuClick = (event: { currentTarget: React.SetStateAction<null>; }) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Function to handle upcoming orders button click
   * It navigates the user to the upcoming orders page
   * @returns {void}
   * @description This function is triggered when the user clicks on the "My Profile" button.
   * It redirects the user to their profile page in the bookstore application.
   */
  const handleUpComing = () => {
  navigate("/upcoming");
  };

  /**
   * Function to handle menu close
   * It sets the anchor element to null, effectively closing the menu
   * @returns {void}
   * @description This function is triggered when the user clicks outside the menu or selects an option.
   * It closes the menu by setting the anchor element to null.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Function to handle profile button click
   * It navigates the user to the profile page
   * @returns {void}
   * @description This function is triggered when the user clicks on the "My Profile" button.
   * It redirects the user to their profile page in the bookstore application.
   */
  const handleProfile = () => {
    handleClose();
    navigate("/profile");
  };

  /**
   * Function to handle logout button click
   * It clears local storage and navigates the user to the sign-in page
   * @returns {void}
   * @description This function is triggered when the user clicks on the "Logout" button.
   * It clears the local storage and redirects the user to the sign-in page of the bookstore application.
   */
  const handleLogout = () => {
    handleClose();
    localStorage.clear();
    navigate("/signin");
  };

  /**
   * Function to handle continue shopping button click
   * It navigates the user to the home page
   * @returns {void}
   * @description This function is triggered when the user clicks on the "Continue Shopping" button.
   * It redirects the user to the home page of the bookstore application.
   */
  const handleContinueShopping = () => {
    navigate("/home");
  };

  // Redirect to cart if orderId is not available in location state
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
