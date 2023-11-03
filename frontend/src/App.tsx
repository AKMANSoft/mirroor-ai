import axios from "axios"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HomePage from "./pages/Home"
import RegisterPage from "./pages/Register"
import LoginPage from "./pages/Login"
import ResetPasswordPage from "./pages/ResetPassword"
import CreateNewPasswordPage from "./pages/CreateNewPassword"
import { I18nextProvider } from "react-i18next"
import i18n from "./lib/i18n"
import EmailVerifiedPage from "./pages/EmailVerified"


// const HomePage = React.lazy(() => import("./pages/Home"))
// const RegisterPage = React.lazy(() => import("./pages/Register"))
// const LoginPage = React.lazy(() => import("./pages/Login"))


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />

  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />
  },
  {
    path: "/create-new-password/:sessionId",
    element: <CreateNewPasswordPage />
  },
  {
    path: "/email-verified",
    element: <EmailVerifiedPage />
  },
])

export default function App() {
  // axios.defaults.baseURL = "http://localhost:8000"
  axios.defaults.withCredentials = true


  return (
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  )
}


