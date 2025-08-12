import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Book from "./components/Book";
import Cart from "./components/Cart"; 
import Order from "./components/Order"; 
import UpComing from "./components/UpComing"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Book />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/cart" element={<Cart cartCount={0} />} /> 
        <Route path="/order" element={<Order />} />
        <Route path="/upComing" element={<UpComing />} />
        <Route path="*" element={<Book />} />
      </Routes>
    </Router>
  );
}

export default App;

