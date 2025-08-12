import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/userService.tsx";

const roles = ["USER", "ADMIN"];

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    role: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", 
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSignUp = async () => {
    const { firstName, lastName, dob, email, password, role } = form;

    if (!firstName || !lastName || !dob || !email || !password || !role) {
      showSnackbar("All fields are required. Please fill in all the details.", "error");
      return;
    }

    try {
      const response = await signUp(form);
      if (response.status === 201 || response.status === 200) {
        showSnackbar("Registration successful!", "success");
        setTimeout(() => navigate("/signIn"), 1000);
      } else {
        showSnackbar("Registration failed. Please try again.", "error");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Email ID Already Taken | Try With Different Email.";
      showSnackbar(errorMessage, "error");
      console.error("SignUp Error:", err);
    }
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
      <Container
        maxWidth="xl"
        sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Card sx={{ width: 400, p: 2 }}>
          <CardContent>
            <Typography variant="h5" align="center">Sign up</Typography>
            <Stack spacing={2} mt={2}>
              <TextField name="firstName" label="First Name" value={form.firstName} onChange={handleChange} fullWidth />
              <TextField name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} fullWidth />
              <TextField
                name="dob"
                label="Date of Birth"
                type="date"
                value={form.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField name="email" label="Email" type="email" value={form.email} onChange={handleChange} fullWidth />
              <TextField name="password" label="Password" type="password" value={form.password} onChange={handleChange} fullWidth />
              <TextField select label="Role" name="role" value={form.role} onChange={handleChange} fullWidth>
                {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
              <Button variant="contained" onClick={handleSignUp} sx={{ background: "linear-gradient(to right, #000, #333)" }}>Sign up</Button>
              <Divider>or</Divider>
              <Typography variant="body2" align="center">
                Already have an account? <Link to="/signIn">Sign in</Link>
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

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity as any} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;

