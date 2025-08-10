import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardPage from "./pages/DashboardPage.tsx";
import SellerLoginPage from "./pages/SellerLogin.tsx";
import App from "./App.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./contexts/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PartnerLoginPage from "./pages/PartnerLogin.tsx";
import HomePage from "./pages/Home.tsx";
import Dashboard from "./components/Dashboard.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import SubmitShipmentsPage from "./pages/SubmitShipmentPage.tsx";
import UpdateShipmentPage from "./pages/UpdateShipmentPage.tsx";
import SellerForgotPasswordPage from "./pages/SellerForgotPasswordPage.tsx";
import PartnerForgotPasswordPage from "./pages/PartnerForgotPasswordPage.tsx";
import ResetPasswordForm from "./pages/ResetPasswordForm.tsx";
import { UserType } from "./lib/client.ts";
import SellerSignup from "./pages/SellerSignup.tsx";
import PartnerSignup from "./pages/PartnerSignup.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1>Hey</h1>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "account",
                element: <AccountPage />,
              },
              {
                path: "submit-shipment",
                element: <SubmitShipmentsPage />,
              },
              {
                path: "update-shipment",
                children: [
                  {
                    index: true,
                    element: <UpdateShipmentPage />,
                  },
                  {
                    path: ":shipmentID",
                    element: <UpdateShipmentPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "seller",
        children: [
          { index: true, element: <SellerLoginPage /> },
          {
            path: "login",
            element: <SellerLoginPage />,
          },
          {
            path: "reset_password_form",
            element: <ResetPasswordForm mode={UserType.Seller} />,
          },
          {
            path: "signup",
            element: <SellerSignup />,
          },
        ],
      },
      {
        path: "partner",
        children: [
          { index: true, element: <PartnerLoginPage /> },
          {
            path: "login",
            element: <PartnerLoginPage />,
          },
          {
            path: "reset_password_form",
            element: <ResetPasswordForm mode={UserType.Partner} />,
          },
          {
            path: "signup",
            element: <PartnerSignup />,
          },
        ],
      },
      {
        path: "seller/forgot-password",
        element: <SellerForgotPasswordPage />,
      },
      {
        path: "partner/forgot-password",
        element: <PartnerForgotPasswordPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
    <Toaster position="top-center" reverseOrder={true} />
  </QueryClientProvider>
);
