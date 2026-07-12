import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

/**
 * Application router.
 *
 * Routes:
 *  /          → ProtectedRoute → DashboardPage  (redirects to /login if unauthed)
 *  /login     → LoginPage                       (redirects to / if already authed)
 *  /signup    → SignupPage                       (redirects to / if already authed)
 *  *          → /login fallback
 */
const router = createBrowserRouter([
  {
    // Protected shell — ProtectedRoute renders <Outlet /> for children
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    // Catch-all: redirect unknown paths to login
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
