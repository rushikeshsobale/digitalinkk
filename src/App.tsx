import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { FaStore, FaShoppingCart } from "react-icons/fa";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import { useAppSelector } from "./redux/hooks";

const App = () => {
  const cartItems = useAppSelector((state) => state.cart.items);

  const activeClass =
    "border-b-2 border-white font-bold flex items-center space-x-1";

  const inactiveClass = "flex items-center space-x-1 hover:opacity-80";

  return (
    <Router>
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">DigitalInkk</h1>

        <div className="flex items-center space-x-6 relative">
          <NavLink
            to="/digitalinkk/"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
          
            <span>Store</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <div className="relative flex items-center">
            
              <span className="ml-1">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </nav>

      {/* Routes */}
      <div className="p-4">
        <Routes>
          <Route path="/digitalinkk/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
