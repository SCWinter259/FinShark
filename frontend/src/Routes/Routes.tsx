import {createBrowserRouter} from "react-router-dom";
import App from '../App.tsx';
import HomePage from "../Pages/HomePage.tsx";
import SearchPage from "../Pages/SearchPage.tsx";
import CompanyPage from "../Pages/CompanyPage.tsx";
import CompanyProfile from "../Components/CompanyProfile.tsx";
import IncomeStatement from "../Components/IncomeStatement.tsx";
import BalanceSheet from "../Components/BalanceSheet.tsx";
import CashflowStatement from "../Components/CashflowStatement.tsx";
import LoginPage from "../Pages/LoginPage.tsx";
import RegisterPage from "../Pages/RegisterPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import PortfolioPage from "../Pages/PortfolioPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: "login", element: <ProtectedRoute><LoginPage/></ProtectedRoute>},
            {path: "register", element: <ProtectedRoute><RegisterPage/></ProtectedRoute>},
            {path: "search", element: <ProtectedRoute><SearchPage/></ProtectedRoute>},
            {path: "portfolio", element: <ProtectedRoute><PortfolioPage/></ProtectedRoute>},
            {path: "company/:ticker", element: <ProtectedRoute><CompanyPage/></ProtectedRoute>,
                // comments down here for dev testing only (no protected routes, no logging in)
            // {path: "search", element: <SearchPage/>},
            // {path: "portfolio", element: <PortfolioPage/>},
            // {path: "company/:ticker", element: <CompanyPage/>,
                children: [
                    {path: "company-profile", element: <CompanyProfile/>},
                    {path: "income-statement", element: <IncomeStatement/>},
                    {path: "balance-sheet", element: <BalanceSheet/>},
                    {path: "cashflow-statement", element: <CashflowStatement/>},
                ]
            }
        ]
    }
]);