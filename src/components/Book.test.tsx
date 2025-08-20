import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Book from "../components/Book"; // adjust path
import { getBooks } from "../services/bookService";
import { addToCart } from "../services/cartService";
import { BrowserRouter } from "react-router-dom";



beforeEach(() => {
  localStorage.clear();   // ✅ ensure no token exists
  mockNavigate.mockClear();
});

// mock services
jest.mock("../services/bookService");
jest.mock("../services/cartService", () => ({
  addToCart: jest.fn(),
}));

// mock react-router navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockBooks = [
  {
    bookId: 1,
    bookName: "The Great Gatsby",
    bookAuthor: "F. Scott Fitzgerald",
    bookPrice: 299,
    bookLogoMultipart: "gatsby.jpg",
    bookQuantity: 5,
    bookDescription: "Classic novel",
  },
  {
    bookId: 2,
    bookName: "Out of Stock Book",
    bookAuthor: "Unknown",
    bookPrice: 199,
    bookLogoMultipart: "noimage.jpg",
    bookQuantity: 0,
    bookDescription: "Unavailable",
  },
];

describe("📚 Book Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderBook = () =>
    render(
      <BrowserRouter>
        <Book />
      </BrowserRouter>
    );

  // -------- SUCCESS PATH --------
  it("✅ should render books fetched successfully", async () => {
    (getBooks as jest.Mock).mockResolvedValueOnce(mockBooks);

    renderBook();

    expect(await screen.findByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("Out of Stock Book")).toBeInTheDocument();
    expect(screen.getByText("OUT OF STOCK")).toBeInTheDocument();
  });

  it("✅ should add a book to cart successfully", async () => {
    localStorage.setItem("token", "mock-token");
    (getBooks as jest.Mock).mockResolvedValueOnce(mockBooks);
    (addToCart as jest.Mock).mockResolvedValueOnce({ message: "Added" });

    renderBook();

    const addButton = await screen.findByText("Add to Bag");
    fireEvent.click(addButton);

    await waitFor(() =>
      expect(addToCart).toHaveBeenCalledWith(1)
    );
    expect(await screen.findByText("The Great Gatsby")).toBeInTheDocument();
  });

  it("✅ should navigate to signin when clicking shopping cart if not logged in", async () => {
    (getBooks as jest.Mock).mockResolvedValueOnce(mockBooks);

    renderBook();

     // click shopping cart
  const cartButton = screen.getByRole("button", { name: /shopping cart/i });
  fireEvent.click(cartButton);

    expect(mockNavigate).toHaveBeenCalledWith("/signin");
  });

  // -------- FAILURE PATH --------
  it("❌ should show error if fetching books fails", async () => {
    const error = new Error("Failed to fetch");
    (getBooks as jest.Mock).mockRejectedValueOnce(error);

    renderBook();

    await waitFor(() => {
      expect(getBooks).toHaveBeenCalled();
    });

    // No book should be rendered
    expect(screen.queryByText("The Great Gatsby")).not.toBeInTheDocument();
  });

  it("❌ should fail to add a book to cart", async () => {
    localStorage.setItem("token", "mock-token");
    (getBooks as jest.Mock).mockResolvedValueOnce(mockBooks);
    (addToCart as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to add")
    );

    renderBook();

    const addButton = await screen.findByText("Add to Bag");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addToCart).toHaveBeenCalledWith(1);
    });
  });
});
