import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,

  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Toolbar,
  Tooltip,
  Typography,
  Badge,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../services/bookService";
import { addToCart } from "../services/cartService";
import Grid from "@mui/material/Grid";

/**
  * Book component that displays a list of books with pagination, user account menu, and cart functionality.
  * This component fetches books from the server, displays them in a grid format
  * and provides functionality for pagination, user account management, and adding books to the cart.
  * It uses Material-UI for styling and layout, and manages state for books, pagination, user account menu, and cart count.
  * Upon clicking on a book, it allows users to add the book to their cart or wishlist.
  * It also provides a user account menu for signing in, signing up, viewing profile,
  * orders, wishlist, and logging out.
  * It includes error handling for image loading and cart operations.
 */

/**
 * Represents a book in the bookstore.
 * @typedef {Object} Book
 * @property {number} bookId - The unique identifier for the book.
 * @property {string} bookName - The name of the book.
 * @property {string} bookAuthor - The author of the book.
 * @property {number} bookPrice - The price of the book.
 * @property {string} bookLogoMultipart - The image path for the book cover.
 * @property {number} bookQuantity - The available quantity of the book.
 * @property {string} bookDescription - A brief description of the book.
 */
type Book = {
  bookId: number;
  bookName: string;
  bookAuthor: string;
  bookPrice: number;
  bookLogoMultipart: string;
  bookQuantity: number;
  bookDescription: string;
};

/**
 * Book component that displays a list of books with pagination, user account menu, and cart functionality.
 * @returns {JSX.Element} The rendered Book component.
 * @description This component fetches books from the server, displays them in a grid format,
 * and provides functionality for pagination, user account management, and adding books to the cart.
 */
const Book = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const booksPerPage = 16;
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [addedBooks, setAddedBooks] = useState<number[]>([]);
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  /**
   * Fetches books from the server when the component mounts.
   * @returns {void}
   * @description This function retrieves the list of books and updates the state.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
        console.log(data);
        console.log(books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };
    fetchData();
  }, []);

  /**
   * Handles page change for pagination.
   * @param {React.ChangeEvent<unknown>} _ - The event object (not used).
   * @param {number} value - The new page number.
   * * @returns {void}
   * @description This function updates the current page state when the user navigates through the pagination
   */
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  /**
   * Handles the click event for the user account menu.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event object.
   * @returns {void}
   * @description This function sets the anchor element for the menu to open it.
   */
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user account menu.
   * @returns {void}
   * @description This function sets the anchor element to null, effectively closing the menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handles navigation to the upcoming page.
   * @returns {void}
   * @description This function navigates the user to the upcoming page.
   */
  const handleUpComing = () => {
    navigate("/upcoming");
  };

  /**
   * Handles user logout by clearing the token and redirecting to the home page.
   * @returns {void}
   * @description This function removes the token from local storage, navigates to the home page,
   * and reloads the window to reflect the changes.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  /**
   * Handles navigation to the shopping cart.
   * If the user is not logged in, redirects to the sign-in page.
   * @returns {void}
   * @description This function checks if the user is logged in and navigates to the cart page,
   * or redirects to the sign-in page if not logged in.
   */
  const handleShoppingCart = () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    navigate("/cart");
  };

  /**
   * Handles adding a book to the cart.
   * If the user is not logged in, redirects to the sign-in page.
   * If the book is already added, skips incrementing the cart count.
   * @param {number} bookId - The ID of the book to add to the cart.
   * @returns {Promise<void>}
   * @description This function checks if the user is logged in, adds the book to the cart,
   * and updates the cart count and added books state.
   */
  const handleAddToCart = async (bookId: number) => {
    if (!token) {
      navigate("/signin");
      return;
    }
    try {
      if (!addedBooks.includes(bookId)) {
        setCartCount(prev => prev + 1);
        setAddedBooks(prev => [...prev, bookId]);
        await addToCart(bookId);
        console.log("Book added to cart successfully.");
      } else {
        console.log("Book already added to cart. Skipping count.");
      }
    } catch (error) {
      console.error("Error adding book to cart:", error);
    }
  };

  /**
   * Calculates the paginated books based on the current page and books per page.
   * @returns {Book[]} The array of books for the current page.
   * @description This function slices the books array to get only the books for the current page.
   */
  const paginatedBooks = books.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <AppBar position="static" color="primary">
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* <IconButton color="inherit" onClick={handleShoppingCart}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton> */}

              <IconButton
                aria-label="shopping cart"
                color="inherit"
                onClick={() => {
                  if (!isLoggedIn) {
                    navigate("/signin");
                  } else {
                    navigate("/cart");
                  }
                }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>



              <IconButton color="inherit" onClick={handleMenuClick}>
                <AccountCircle />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {!isLoggedIn
                  ? [
                    <MenuItem key="signin" onClick={() => { navigate("/signin"); handleMenuClose(); }}>Sign In</MenuItem>,
                    <MenuItem key="signup" onClick={() => { navigate("/signup"); handleMenuClose(); }}>Sign Up</MenuItem>,
                  ]
                  : [
                    <MenuItem key="profile" onClick={() => { navigate("/profile"); handleUpComing(); }}>My Profile</MenuItem>,
                    <MenuItem key="orders" onClick={() => { navigate("/orders"); handleUpComing(); }}>Orders</MenuItem>,
                    <MenuItem key="wishlist" onClick={() => { navigate("/wishlist"); handleUpComing(); }}>Wishlist</MenuItem>,
                    <MenuItem key="logout" onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>,
                  ]}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Explore Our Books
        </Typography>

        <Grid container spacing={4}>
          {paginatedBooks.map((book) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={book.bookId}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Tooltip title={book.bookDescription} arrow>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`/src/assets/${book.bookLogoMultipart}`}
                    alt={book.bookName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/200x200?text=No+Image";
                    }}
                  />
                </Tooltip>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {book.bookName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.bookAuthor}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    ₹{book.bookPrice}
                  </Typography>

                  {book.bookQuantity > 0 ? (
                    <Box mt={2} display="flex" gap={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddToCart(book.bookId)}
                      >
                        Add to Bag
                      </Button>
                      <Button variant="outlined" size="small" onClick={() => handleUpComing()}>
                        Wishlist
                      </Button>
                    </Box>
                  ) : (
                    <Typography color="error" mt={2}>
                      OUT OF STOCK
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="center" mt={5}>
          <Pagination
            count={Math.ceil(books.length / booksPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
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

export default Book;

