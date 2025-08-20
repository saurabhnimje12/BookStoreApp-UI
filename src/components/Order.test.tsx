// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import { MemoryRouter, Route, Routes } from "react-router-dom";
// import Order from "../components/Order"; 
// import "@testing-library/jest-dom";

// const mockNavigate = jest.fn();
// let mockLocation: any;

// // mock react-router
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useNavigate: () => mockNavigate,
//   useLocation: () => mockLocation,
// }));

// describe("Order Component", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     localStorage.clear();
//   });

//   const renderWithRouter = (locationState?: any) => {
//     mockLocation = { state: locationState };
//     return render(
//       <MemoryRouter initialEntries={["/success"]}>
//         <Routes>
//           <Route path="/success" element={<Order />} />
//         </Routes>
//       </MemoryRouter>
//     );
//   };

//   // ✅ Success rendering
//   it("renders success message with valid orderId", () => {
//     renderWithRouter({ orderId: "12345" });

//     expect(screen.getByText("Order Placed Successfully")).toBeInTheDocument();
//     expect(screen.getByText(/#12345/)).toBeInTheDocument();
//     expect(screen.getByText(/admin@bookstore.com/)).toBeInTheDocument();
//     expect(screen.getByText(/\+91 8163475881/)).toBeInTheDocument();
//   });

//   // ❌ Failure case → no orderId
//   it("redirects to /cart if no orderId is present", async () => {
//     renderWithRouter(undefined);

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith("/cart");
//     });
//   });

//   // ✅ Continue shopping
//   it("navigates to home when clicking 'CONTINUE SHOPPING'", () => {
//     renderWithRouter({ orderId: "98765" });

//     fireEvent.click(screen.getByRole("button", { name: /continue shopping/i }));
//     expect(mockNavigate).toHaveBeenCalledWith("/home");
//   });

//   // ✅ Account menu interactions
//   it("opens menu and navigates to profile", () => {
//     renderWithRouter({ orderId: "11111" });

//     fireEvent.click(screen.getByRole("button", { name: /account/i }));
//     expect(screen.getByText("My Profile")).toBeInTheDocument();
//     expect(screen.getByText("Logout")).toBeInTheDocument();

//     fireEvent.click(screen.getByText("My Profile"));
//     expect(mockNavigate).toHaveBeenCalledWith("/profile");
//   });

//   // ✅ Logout
//   it("logs out user and navigates to signin", () => {
//     localStorage.setItem("token", "test-token");
//     renderWithRouter({ orderId: "22222" });

//     fireEvent.click(screen.getByRole("button", { name: /account/i }));
//     fireEvent.click(screen.getByText("Logout"));

//     expect(localStorage.getItem("token")).toBeNull();
//     expect(mockNavigate).toHaveBeenCalledWith("/signin");
//   });

//   // ✅ AppBar navigation
//   it("navigates to home when clicking app title or icon", () => {
//     renderWithRouter({ orderId: "33333" });

//     fireEvent.click(screen.getByText("Bookstore"));
//     expect(mockNavigate).toHaveBeenCalledWith("/");

//     fireEvent.click(screen.getByTestId("MenuBookIcon")); 
//     expect(mockNavigate).toHaveBeenCalledWith("/");
//   });

//   // ❌ Edge case → invalid location state
//   it("redirects to /cart if location.state exists but no orderId", async () => {
//     renderWithRouter({ notOrderId: "oops" });

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith("/cart");
//     });
//   });

//   // ✅ Closing menu when clicking outside
//   it("closes account menu when handleClose is triggered", () => {
//     renderWithRouter({ orderId: "44444" });

//     fireEvent.click(screen.getByRole("button", { name: /account/i }));
//     expect(screen.getByText("Logout")).toBeInTheDocument();

//     fireEvent.keyDown(document.body, { key: "Escape" });
//     // Menu should close
//     expect(screen.queryByText("Logout")).not.toBeVisible();
//   });
// });
