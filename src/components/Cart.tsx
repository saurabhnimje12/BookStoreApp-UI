import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Container,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircle from "@mui/icons-material/AccountCircle";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import bookImage from "../assets/book1.jpeg";
import {
  getCartById,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeCartItem,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";

/**
 * Cart component that manages the shopping cart functionality.
 * It allows users to view their cart items, update quantities,
 * remove items, and proceed to checkout with customer details.
 * It also includes a stepper to guide users through the cart process.
 * It handles user authentication and navigation using React Router.
 * It fetches cart items from the server and updates the UI accordingly.
 * It validates customer details before placing an order.
 * It displays an order summary before finalizing the purchase.
 * It includes error handling for form validation and API requests. 
 */

const steps = ["My Cart", "Customer Details", "Order Summary"];

const Cart = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [type, setType] = useState("");
  const [errors, setErrors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * useNavigate hook from react-router-dom to programmatically navigate
   * to different routes in the application.
   */
  const navigate = useNavigate();

  /**
   * Fetches cart items when the component mounts and updates the total price.
   */
  useEffect(() => {
    fetchCartItems();
  }, []);

  /**
   * Updates the total price whenever cart items change.
   */
  useEffect(() => {
    setTotalPrice(cartItems.reduce((sum, item) => sum + item.book.price * item.cartQuantity, 0));
  }, [cartItems]);

  /**
   * Fetches cart items from the server and updates the state.
   * Handles errors if the fetch fails.
   */
  const fetchCartItems = async () => {
    try {
      const data = await getCartById();
      setCartItems(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  
  /**
   * Handles navigation to the upcoming page.
   */
  const handleUpComing = () => {
  navigate("/upcoming");
  };

  /**
   * Handles the addition of a cart item.
   * @param {number} cartId - The ID of the cart item to be added.
   */
  const handleAdd = async (cartId: number) => {
    await increaseCartQuantity(cartId);
    fetchCartItems();
  };

  /**
   * Handles the removal of a cart item.
   * @param {number} cartId - The ID of the cart item to be removed.
   */
  const handleRemove = async (cartId: number) => {
    await decreaseCartQuantity(cartId);
    fetchCartItems();
  };

  /**
   * Handles the deletion of a cart item.
   * @param {number} cartId - The ID of the cart item to be deleted.
   */
  const handleDelete = async (cartId: number) => {
    await removeCartItem(cartId);
    fetchCartItems();
  };

  /**
   * Validates customer details before proceeding to checkout.
   * @returns {boolean} - Returns true if all fields are valid, otherwise false.
   */
  const validateCustomerDetails = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!pincode) newErrors.pincode = "Pincode is required";
    if (!locality) newErrors.locality = "Locality is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City/Town is required";
    if (!landmark) newErrors.landmark = "Landmark is required";
    if (!type) newErrors.type = "Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the checkout process by validating customer details and placing the order.
   */
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Token not found");

    const payload = { name, phoneNumber, pincode, locality, address, city, landmark, type };

    try {
      const result = await placeOrder(payload, token);
      alert("Order placed successfully!");
      navigate("/order", { state: { orderId: result.data.orderId } });
    } catch (error) {
      alert("Order failed");
    }
  };

  
  /**
   * Renders the content for each step in the cart process.
   * @param {number} step - The current step index.
   * @returns {JSX.Element}
   */ 
  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Typography variant="h6">My Cart ({cartItems.length})</Typography>
            {cartItems.length === 0 ? (
              <Typography sx={{ mt: 2 }}>Your cart is empty.</Typography>
            ) : (
              cartItems.map((item) => (
                <Card key={item.cartId} sx={{ display: "flex", mb: 2 }}>
                  <CardMedia
                    component="img"
                    image={item.book.imageUrl || bookImage}
                    alt={item.book.title}
                    sx={{ width: 120, p: 2 }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6">{item.book.title}</Typography>
                    <Typography variant="body2">by {item.book.author}</Typography>
                    <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                      Rs. {item.book.price}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Button onClick={() => handleRemove(item.cartId)}>
                        <RemoveIcon />
                      </Button>
                      <Typography sx={{ mx: 2 }}>{item.cartQuantity}</Typography>
                      <Button onClick={() => handleAdd(item.cartId)}>
                        <AddIcon />
                      </Button>
                      <Button sx={{ ml: 2 }} onClick={() => handleDelete(item.cartId)}>
                        Remove
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => {
                if (cartItems.length === 0) return;
                setActiveStep(1);
              }}
            >
              Continue
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6">Customer Details</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                required
              />
              <TextField
                label="Phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                fullWidth
                required
              />
              <TextField
                label="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                error={!!errors.pincode}
                helperText={errors.pincode}
                fullWidth
                required
              />
              <TextField
                label="Locality"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                error={!!errors.locality}
                helperText={errors.locality}
                fullWidth
                required
              />
              <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!errors.address}
                helperText={errors.address}
                fullWidth
                multiline
                rows={2}
                sx={{ gridColumn: "1 / 3" }}
              />
              <TextField
                label="City/Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
                fullWidth
                required
              />
              <TextField
                label="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                error={!!errors.landmark}
                helperText={errors.landmark}
                fullWidth
                required
              />
            </Box>
            <FormLabel sx={{ mt: 2 }}>Type</FormLabel>
            <RadioGroup row value={type} onChange={(e) => setType(e.target.value)}>
              <FormControlLabel value="Home" control={<Radio />} label="Home" />
              <FormControlLabel value="Work" control={<Radio />} label="Work" />
              <FormControlLabel value="Other" control={<Radio />} label="Other" />
            </RadioGroup>
            {errors.type && (
              <Typography color="error" variant="caption">
                {errors.type}
              </Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button onClick={() => setActiveStep(0)}>Back</Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (validateCustomerDetails()) setActiveStep(2);
                }}
              >
                Continue
              </Button>
            </Box>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6">Order Summary</Typography>
            {cartItems.map((item) => (
              <Box
                key={item.cartId}
                sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
              >
                <Typography>
                  {item.book.title} (x{item.cartQuantity})
                </Typography>
                <Typography>
                  Rs. {item.book.price * item.cartQuantity}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total Price: Rs. {totalPrice}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button onClick={() => setActiveStep(1)}>Back</Button>
              <Button variant="contained" color="primary" onClick={handleCheckout}>
                Checkout
              </Button>
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <MenuBookIcon sx={{ mr: 1, cursor: "pointer" }} onClick={() => navigate("/")} />
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Bookstore
          </Typography>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleUpComing()}>Profile</MenuItem>
            <MenuItem
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 5 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>
      </Container>

      <Box sx={{ mt: 5, py: 2, bgcolor: "#f5f5f5", textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Bookstore. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Cart;

