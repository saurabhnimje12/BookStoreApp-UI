import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
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

type Book = {
  bookId: number;
  bookName: string;
  bookAuthor: string;
  bookPrice: number;
  bookLogoMultipart: string;
  bookQuantity: number;
  bookDescription: string;
};

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpComing = () => {
    navigate("/upcoming");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  const handleShoppingCart = () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    navigate("/cart");
  };

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
              <IconButton color="inherit" onClick={handleShoppingCart}>
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
                {!isLoggedIn ? (
                  <>
                    <MenuItem onClick={() => { navigate("/signin"); handleMenuClose(); }}>Sign In</MenuItem>
                    <MenuItem onClick={() => { navigate("/signup"); handleMenuClose(); }}>Sign Up</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => { navigate("/profile"); handleUpComing(); }}>My Profile</MenuItem>
                    <MenuItem onClick={() => { navigate("/orders"); handleUpComing(); }}>Orders</MenuItem>
                    <MenuItem onClick={() => { navigate("/wishlist"); handleUpComing(); }}>Wishlist</MenuItem>
                    <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                  </>
                )}
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
            <Grid item xs={12} sm={6} md={3} key={book.id}>
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

