import React, { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/products/productSlilce";
import { useLocation, Link } from "react-router-dom";

const OurStore = () => {
  const [grid, setGrid] = useState(4);
  const productState = useSelector((state) => state?.product?.product);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // filters
  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setminPrice] = useState(null);
  const [maxPrice, setmaxPrice] = useState(null);
  const [sort, setSort] = useState(null);

  const dispatch = useDispatch();

  // ✅ READ CATEGORY FROM URL (/product?category=Mobiles)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  // Fetch products when filters change
  useEffect(() => {
    dispatch(
      getAllProducts({
        sort,
        tag,
        brand,
        category: categoryFromURL || category, // <-- AUTO FILTER
        minPrice,
        maxPrice,
      })
    );
  }, [sort, tag, brand, category, categoryFromURL, minPrice, maxPrice]);

  // Extract brand, category, tags
  useEffect(() => {
    let newBrands = [];
    let newCategories = [];
    let newTags = [];

    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      newBrands.push(element.brand);
      newCategories.push(element.category);
      newTags.push(element.tags);
    }

    setBrands(newBrands);
    setCategories(newCategories);
    setTags(newTags);
  }, [productState]);

  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />

      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="row">

          {/* LEFT SIDE FILTERS */}
          <div className="col-3">
            <div className="filter-card mb-3">
              <h3 className="filter-title">Shop By Categories</h3>
              <div>
                <ul className="ps-0">

                  {/* ALL PRODUCTS */}
                  <Link
                    className="ps-0"
                    to="/product"
                    style={{ color: "var(--color-777777)" }}
                  >
                    All
                  </Link>

                  {/* DYNAMIC CATEGORY LIST */}
                  {categories &&
                    [...new Set(categories)].map((item, index) => (
                      <li
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => setCategory(item)}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="filter-card mb-3">
              <h3 className="filter-title">Filter By</h3>

              {/* PRICE FILTER */}
              <h5 className="sub-title">Price</h5>
              <div className="d-flex align-items-center gap-10">
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="From"
                    onChange={(e) => setminPrice(e.target.value)}
                  />
                  <label>From</label>
                </div>

                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="To"
                    onChange={(e) => setmaxPrice(e.target.value)}
                  />
                  <label>To</label>
                </div>
              </div>

              {/* TAGS */}
              <div className="mt-4 mb-3">
                <h3 className="sub-title">Product Tags</h3>
                <div className="product-tags d-flex flex-wrap gap-10">
                  {tags &&
                    [...new Set(tags)].map((item, index) => (
                      <span
                        key={index}
                        onClick={() => setTag(item)}
                        className="badge bg-light text-secondary rounded-3 py-2 px-3"
                        style={{ cursor: "pointer" }}
                      >
                        {item}
                      </span>
                    ))}
                </div>
              </div>

              {/* BRANDS */}
              <div className="mt-4 mb-3">
                <h3 className="sub-title">Brands</h3>
                <div className="product-tags d-flex flex-wrap gap-10">
                  {brands &&
                    [...new Set(brands)].map((item, index) => (
                      <span
                        key={index}
                        onClick={() => setBrand(item)}
                        className="badge bg-light text-secondary rounded-3 py-2 px-3"
                        style={{ cursor: "pointer" }}
                      >
                        {item}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS RIGHT SIDE */}
          <div className="col-9">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex justify-content-between align-items-center">

                {/* SORT AREA */}
                <div className="d-flex align-items-center gap-10">
                  <p className="mb-0" style={{ width: "100px" }}>
                    Sort By:
                  </p>

                  <select
                    className="form-control form-select"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="title">A-Z</option>
                    <option value="-title">Z-A</option>
                    <option value="price">Price, low to high</option>
                    <option value="-price">Price, high to low</option>
                    <option value="createdAt">Oldest</option>
                    <option value="-createdAt">Newest</option>
                  </select>
                </div>

                {/* GRID SELECTOR */}
                <div className="d-flex align-items-center gap-10">
                  <p className="totalproducts mb-0">
                    {productState?.length} Products
                  </p>
                </div>
              </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="products-list pb-5">
              <div className="d-flex gap-10 flex-wrap">
                <ProductCard
                  data={productState ? productState : []}
                  grid={grid}
                />
              </div>
            </div>
          </div>

        </div>
      </Container>
    </>
  );
};

export default OurStore;
