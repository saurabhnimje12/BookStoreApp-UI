import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../services/userService.tsx";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await signIn({ email, password });

      if (response.status === 200 && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
        setTimeout(() => navigate("/book"), 1500); // small delay to let snackbar show
      } else {
        setSnackbar({
          open: true,
          message: "Login failed | Please check your credentials.",
          severity: "error",
        });
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Login failed | Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      console.error("SignIn Error:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Container
        maxWidth="xl"
        sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Card sx={{ width: 400, p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <LockIcon />
              </Avatar>
            </Box>
            <Typography variant="h5" align="center">
              Sign in
            </Typography>
            <Stack spacing={2} mt={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSignIn}
                sx={{ background: "linear-gradient(to right, #000, #333)" }}
              >
                Sign in
              </Button>
              <Divider>or</Divider>
              <Typography variant="body2" align="center">
                Don't have an account? <Link to="/signUp">Sign up</Link>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          bgcolor: "grey.200",
          mt: "auto",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Online Bookstore. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;

