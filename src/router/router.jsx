import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/customer/Home";
import Account from "../pages/customer/Account";
import Cart from "../pages/customer/Cart";
import OrderSuccess from "../pages/customer/Order";
import Checkout from "../pages/customer/Checkout";
import Search from "../pages/customer/Search";
import Error from "../pages/error";
import PaymentResult from "../pages/customer/Payment/PaymentSuccess";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import ProductDetail from "../pages/customer/ProductDetail";
import PrivateRoute from "../components/PrivateRoutes/PrivateRoute";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ProductManager from "../pages/admin/Product";
import OrderManager from "../pages/admin/Order";
import OrderDetail from "../pages/admin/Order/OrderDetail";
import ShipmentManager from "../pages/admin/Shipment";
import PromotionManager from "../pages/admin/Promotion";
import PromotionForm from "../pages/admin/Promotion/PromotionForm";
import PromotionDetail from "../pages/admin/Promotion/PromotionDetail";
import PromotionAnalytics from "../pages/admin/Promotion/PromotionAnalytics";
import VoucherGenerator from "../pages/admin/Promotion/VouchersGenerator";
import MarketingIntegration from "../pages/admin/Promotion/MarketingIntegration";
import CustomerManager from "../pages/admin/Customer";
import CustomerDetail from "../pages/admin/Customer/CustomerDetails";
import ProductForm from "../pages/admin/Product/Form/ProductForm";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPassword/ForgotPasswordPage";
import VerifyOtpResetPasswordPage from "../pages/auth/ForgotPassword/VerifyOtpResetPasswordPage";
import AdminRoute from "../components/PrivateRoutes/AdminRoute";
export const routes = [
  {
    path: "/",
    element: <CustomerLayout />,
    breadcrumb: "Home",
    children: [
      { path: "/", element: <Home />, breadcrumb: "Home" },
      { path: "search", element: <Search />, breadcrumb: "Search" },
      { path: "product-detail/:productID", element: <ProductDetail />, breadcrumb: "ProductDetail" },
      { path: "cart",element: (
        <PrivateRoute>
          <Cart />
        </PrivateRoute>
      ), breadcrumb: "Cart" },
      { path: "payment-result", element: <PaymentResult />, breadcrumb: "Payment" },
      { path: "order", element: <OrderSuccess />, breadcrumb: "Order" },
      {
        path: "checkout",
        element: (
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        ),
        breadcrumb: "Checkout",
      },
      {
        path: "account",
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
        breadcrumb: "Account",
      },
    ],
  },
  { path: "*", element: <Error />, breadcrumb: "Not Found" },
  {
    path: "/login", element: <Login /> ,
  },
  {
    path: "/verify-otp", element: <VerifyOtpPage/> ,
  },
  {
    path: "/verify-otp-forgot-pasword", element: <VerifyOtpResetPasswordPage/> ,
  },
  {
    path: "/forgot-password", element: <ForgotPasswordPage/> ,
  },
  { path: "/sign-up", element: <SignUp /> },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <ProductManager />,
        children: [
          {
            path: "create",
            element: <ProductForm mode="create" />,
          },
          {
            path: ":id/edit",
            element: <ProductForm mode="edit" />,
          },
        ]
      },
      {
        path: "orders",
        element: <OrderManager />,
        children: [
          {
            path: ":id",
            element: <OrderDetail />,
          },
        ],
      },
      {
        path: "shipment",
        element: <ShipmentManager />,
      },
      {
        path: "promotions",
        element: <PromotionManager />,
      },
      {
        path: "promotions/create",
        element: <PromotionForm />,
      },
      {
        path: "promotions/:id",
        element: <PromotionDetail />,
      },
      {
        path: "promotions/:id/edit",
        element: <PromotionForm />,
      },
      {
        path: "promotions/analytics",
        element: <PromotionAnalytics />,
      },
      {
        path: "promotions/vouchers",
        element: <VoucherGenerator />,
      },
      {
        path: "promotions/marketing",
        element: <MarketingIntegration />,
      },
      {
        path: "customers",
        element: <CustomerManager />,
        children: [
          {
            path: ":id",
            element: <CustomerDetail />,
          },
        ],
      },
    ],
  }
]