import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";

/* ================= VALIDATION ================= */
let loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Email should be valid"),
  password: yup.string().required("Password is Required"),
});

/* ================= LOGIN COMPONENT ================= */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 GET AUTH STATE FROM REDUX
  const authState = useSelector((state) => state.auth);

  /* ================= FORMIK ================= */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      // 🔹 LOGIN API CALL
      dispatch(loginUser(values));
    },
  });

  /* =================================================
     🔥 MAIN CHANGE IS HERE (AUTO NAVIGATION)
     ================================================= */
  useEffect(() => {
    if (authState.isSuccess && authState.user) {
      navigate("/"); // ✅ Redirect to Home page
    }
  }, [authState.isSuccess, authState.user, navigate]);

  /* ================= UI ================= */
  return (
    <>
      <Meta title={"Login"} />
      <BreadCrumb title="Login" />

      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Login</h3>

              <form
                onSubmit={formik.handleSubmit}
                className="d-flex flex-column gap-15"
              >
                {/* EMAIL */}
                <CustomInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="error">
                  {formik.touched.email && formik.errors.email}
                </div>

                {/* PASSWORD */}
                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <div className="error">
                  {formik.touched.password && formik.errors.password}
                </div>

                <Link to="/forgot-password">Forgot Password?</Link>

                <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                  <button className="button border-0" type="submit">
                    Login
                  </button>

                  <Link to="/signup" className="button signup">
                    SignUp
                  </Link>
                </div>
              </form>

            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Login;
