// __tests__/Cart.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cart from "../components/Cart";
import {
  getCartById,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeCartItem,
} from "../services/cartService";
import { placeOrder } from "../services/orderService";
import { MemoryRouter } from "react-router-dom";

// Mock services
jest.mock("../services/cartService");
jest.mock("../services/orderService");

const mockGetCartById = getCartById as jest.Mock;
const mockIncreaseCartQuantity = increaseCartQuantity as jest.Mock;
const mockDecreaseCartQuantity = decreaseCartQuantity as jest.Mock;
const mockRemoveCartItem = removeCartItem as jest.Mock;
const mockPlaceOrder = placeOrder as jest.Mock;

const renderCart = () => render(<Cart />, { wrapper: MemoryRouter });

describe("Cart Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-jwt-token");
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ---------------- FETCH CART ----------------
  it("fetches and displays cart items successfully", async () => {
    mockGetCartById.mockResolvedValueOnce([
      {
        cartId: 1,
        cartQuantity: 2,
        book: { title: "Book A", author: "Author A", price: 100, imageUrl: "" },
      },
    ]);

    renderCart();

    expect(await screen.findByText("Book A")).toBeInTheDocument();
    expect(screen.getByText(/Rs\. 100/i)).toBeInTheDocument();
  });

  it("handles error while fetching cart items", async () => {
    mockGetCartById.mockRejectedValueOnce(new Error("Failed to fetch"));
    renderCart();
    await waitFor(() => {
      expect(mockGetCartById).toHaveBeenCalled();
    });
  });

  // ---------------- CART OPERATIONS ----------------
  it("increases cart quantity successfully", async () => {
    mockGetCartById.mockResolvedValueOnce([
      { cartId: 1, cartQuantity: 1, book: { title: "Book A", author: "Auth", price: 50 } },
    ]);
    mockIncreaseCartQuantity.mockResolvedValueOnce({});

    renderCart();

    const addBtn = await screen.findByText(/Add/i);
    fireEvent.click(addBtn);

    await waitFor(() => expect(mockIncreaseCartQuantity).toHaveBeenCalledWith(1));
  });

  it("removes item from cart successfully", async () => {
    mockGetCartById.mockResolvedValueOnce([
      { cartId: 2, cartQuantity: 1, book: { title: "Book B", author: "Auth", price: 80 } },
    ]);
    mockRemoveCartItem.mockResolvedValueOnce({});

    renderCart();

    const removeBtn = await screen.findByText(/Remove/i);
    fireEvent.click(removeBtn);

    await waitFor(() => expect(mockRemoveCartItem).toHaveBeenCalledWith(2));
  });

  it("fails to decrease quantity gracefully", async () => {
    mockGetCartById.mockResolvedValueOnce([
      { cartId: 3, cartQuantity: 2, book: { title: "Book C", author: "Auth", price: 60 } },
    ]);
    mockDecreaseCartQuantity.mockRejectedValueOnce(new Error("Decrease failed"));

    renderCart();

    const decBtn = await screen.findByText(/Remove/i);
    fireEvent.click(decBtn);

    await waitFor(() => expect(mockDecreaseCartQuantity).toHaveBeenCalledWith(3));
  });

  // ---------------- CUSTOMER DETAILS ----------------
  it("shows validation errors for empty customer details", async () => {
    mockGetCartById.mockResolvedValueOnce([
      { cartId: 4, cartQuantity: 1, book: { title: "Book D", author: "Auth", price: 120 } },
    ]);
    renderCart();

    fireEvent.click(await screen.findByRole("button", { name: /continue/i }));

    const continueBtn = screen.getByRole("button", { name: /^continue$/i });
    fireEvent.click(continueBtn);

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required")).toBeInTheDocument();
  });

  // ---------------- ORDER PLACEMENT ----------------
  it("places order successfully", async () => {
    mockGetCartById.mockResolvedValueOnce([
      { cartId: 5, cartQuantity: 1, book: { title: "Book E", author: "Auth", price: 200 } },
    ]);
    mockPlaceOrder.mockResolvedValueOnce({ data: { orderId: 123 } });

    renderCart();

    // Go to details
    fireEvent.click(await screen.findByRole("button", { name: /continue/i }));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Alice" } });
    fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: "9999999999" } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Locality/i), { target: { value: "Test Area" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Some Street" } });
    fireEvent.change(screen.getByLabelText(/City\/Town/i), { target: { value: "Pune" } });
    fireEvent.change(screen.getByLabelText(/Landmark/i), { target: { value: "Near Park" } });
    fireEvent.click(screen.getByLabelText(/Home/i));

    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
    fireEvent.click(await screen.findByRole("button", { name: /checkout/i }));

    await waitFor(() => expect(mockPlaceOrder).toHaveBeenCalled());
  });

  it("fails to place order gracefully", async () => {
    mockGetCartById.mockResolvedValueOnce([
      { cartId: 6, cartQuantity: 1, book: { title: "Book F", author: "Auth", price: 90 } },
    ]);
    mockPlaceOrder.mockRejectedValueOnce(new Error("Order failed"));

    renderCart();

    fireEvent.click(await screen.findByRole("button", { name: /continue/i }));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Bob" } });
    fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: "8888888888" } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: "654321" } });
    fireEvent.change(screen.getByLabelText(/Locality/i), { target: { value: "Test Locality" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "Street 45" } });
    fireEvent.change(screen.getByLabelText(/City\/Town/i), { target: { value: "Delhi" } });
    fireEvent.change(screen.getByLabelText(/Landmark/i), { target: { value: "Mall" } });
    fireEvent.click(screen.getByLabelText(/Work/i));

    fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
    fireEvent.click(await screen.findByRole("button", { name: /checkout/i }));

    await waitFor(() => expect(mockPlaceOrder).toHaveBeenCalled());
  });
});
