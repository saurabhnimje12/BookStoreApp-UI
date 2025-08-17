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

/**
 * SignUp component allows users to create a new account.
 * It includes a form for user details, handles sign-up logic,
 * and displays success or error messages using a snackbar.
 * The component uses Material-UI for styling and layout.
 * It manages state for user details and snackbar messages.
 * Upon successful sign-up, it navigates to the sign-in page.
 */

/**
 * Roles available for user selection during sign-up.
 * This can be extended or modified based on application requirements.
 * @constant {string[]} roles
 * @default ["USER", "ADMIN"] 
 */
const roles = ["USER", "ADMIN"];

/**
 * SignUp component allows users to create a new account.
 * It includes a form for user details, handles sign-up logic,
 * and displays success or error messages using a snackbar.
 */
const SignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    role: "",
  });

  /** * State to manage snackbar visibility and messages.
   * It includes open status, message content, and severity level.
   * @type {{ open: boolean; message: string; severity: "success" | "error" }}
   */
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", 
  });

  /**
   * useNavigate hook from react-router-dom to programmatically navigate
   * to different routes in the application.
   */
  const navigate = useNavigate();

  /**
   * Handles changes in the form fields.
   * Updates the corresponding state based on user input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object from the input change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Handles closing the snackbar when the user clicks the close button or after auto-hide duration.
   * Updates the snackbar state to close it.
   */
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Displays a snackbar with a message and severity level.
   * This function is used to show success or error messages to the user.
   * @param {string} message - The message to display in the snackbar.
   * @param {"success" | "error"} severity - The severity level of the message.
   */
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Handles the sign-up process by calling the signUp service.
   * Validates the form fields and displays appropriate messages.
   * If successful, navigates to the sign-in page.
   * If failed, displays an error message in a snackbar.
   * @returns {Promise<void>}
   */
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

