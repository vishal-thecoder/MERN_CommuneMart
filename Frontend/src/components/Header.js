import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlilce";
import { getUserCart } from "../features/user/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const productState = useSelector((state) => state?.product?.product);

  const [total, setTotal] = useState(null);
  const [paginate] = useState(true);
  const [productOpt, setProductOpt] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  // Load cart
  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  // Calculate cart total
  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum +=
        Number(cartState[index].quantity) * Number(cartState[index].price);
    }
    setTotal(sum);
  }, [cartState]);

  // Search autocomplete data
  useEffect(() => {
    if (productState && productState.length > 0) {
      const data = productState.map((element, index) => ({
        id: index,
        prod: element?._id,
        name: element?.title,
      }));
      setProductOpt(data);
    }
  }, [productState]);

  // Extract unique categories (dynamic)
  useEffect(() => {
    if (productState && productState.length > 0) {
      const unique = [
        ...new Set(productState.map((prod) => prod.category)),
      ].sort();
      setCategories(unique);
    }
  }, [productState]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {/* --- TOP HEADER --- */}
      <header className="header-top-strip py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <p className="text-white mb-0">Free Shipping Over Rs.100</p>
            </div>
            <div className="col-6">
              <p className="text-end text-white mb-0">
                Hotline:
                <a className="text-white" href="tel:+91 9789313666">
                  +91 9789313666
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* --- MIDDLE HEADER --- */}
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            {/* Logo */}
            <div className="col-2">
              <h2>
                <Link className="text-white" to="/">
                  Min Vanigam
                </Link>
              </h2>
            </div>

            {/* Search bar */}
            <div className="col-5">
              <div className="input-group">
                <Typeahead
                  id="pagination-example"
                  onChange={(selected) => {
                    navigate(`/product/${selected[0]?.prod}`);
                    dispatch(getAProduct(selected[0]?.prod));
                  }}
                  options={productOpt}
                  paginate={paginate}
                  labelKey={"name"}
                  placeholder="Search for Products here"
                />
                <span className="input-group-text p-3">
                  <BsSearch className="fs-6" />
                </span>
              </div>
            </div>

            {/* Wishlist / User / Cart */}
            <div className="col-5">
              <div className="header-upper-links d-flex align-items-center justify-content-between">
                <div>
                  <Link
                    to="/wishlist"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={wishlist} alt="wishlist" />
                    <p className="mb-0">
                      Favourite <br /> Wishlist
                    </p>
                  </Link>
                </div>

                <div>
                  <Link
                    to={authState?.user === null ? "/login" : "my-profile"}
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={user} alt="user" />
                    {authState?.user === null ? (
                      <p className="mb-0">
                        Log in <br /> My Account
                      </p>
                    ) : (
                      <p className="mb-0">
                        Welcome {authState?.user?.firstname}
                      </p>
                    )}
                  </Link>
                </div>

                <div>
                  <Link
                    to="/cart"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={cart} alt="cart" />
                    <div className="d-flex flex-column gap-10">
                      <span className="badge bg-white text-dark">
                        {cartState?.length ? cartState.length : 0}
                      </span>
                      <p className="mb-0">
                        Rs. {cartState?.length ? total : 0}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- BOTTOM HEADER (MENU + CATEGORIES) --- */}
      <header className="header-bottom py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center gap-30">
                {/* Categories Dropdown */}
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={menu} alt="menu-icon" />
                      <span className="me-5 d-inline-block">Categories</span>
                    </button>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      {/* STATIC CATEGORIES */}
                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/product?category=Mobiles"
                        >
                          Mobiles
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/product?category=Laptops"
                        >
                          Laptops
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item text-white"
                          to="/product?category=Watches"
                        >
                          Watches
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      {/* DYNAMIC CATEGORIES */}
                      {categories.map((category, index) => (
                        <li key={index}>
                          <Link
                            className="dropdown-item text-white"
                            to={`/product?category=${category}`}
                          >
                            {category}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Other Menu Links */}
                <div className="menu-links">
                  <div className="d-flex align-items-center gap-15">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/product">Our Store</NavLink>
                    <NavLink to="/my-orders">My Orders</NavLink>
                    <NavLink to="/blogs">Blogs</NavLink>
                    <NavLink to="/contact">Contact</NavLink>

                    {authState?.user !== null && (
                      <button
                        className="border-0 bg-transparent text-white text-uppercase"
                        type="button"
                        onClick={handleLogout}
                      >
                        LogOut
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
