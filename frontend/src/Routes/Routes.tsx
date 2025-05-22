import {createBrowserRouter} from "react-router-dom";
import App from '../App.tsx';
import HomePage from "../Pages/HomePage/HomePage.tsx";
import SearchPage from "../Pages/SearchPage/SearchPage.tsx";
import CompanyPage from "../Pages/CompanyPage/CompanyPage.tsx";
import CompanyProfile from "../Components/CompanyProfile/CompanyProfile.tsx";
import IncomeStatement from "../Components/IncomeStatement/IncomeStatement.tsx";
import BalanceSheet from "../Components/BalanceSheet/BalanceSheet.tsx";
import CashflowStatement from "../Components/CashflowStatement/CashflowStatement.tsx";
import LoginPage from "../Pages/LoginPage/LoginPage.tsx";
import RegisterPage from "../Pages/RegisterPage/RegisterPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: "login", element: <ProtectedRoute><LoginPage/></ProtectedRoute>},
            {path: "register", element: <ProtectedRoute><RegisterPage/></ProtectedRoute>},
            {path: "search", element: <ProtectedRoute><SearchPage/></ProtectedRoute>},
            {path: "company/:ticker", element: <ProtectedRoute><CompanyPage/></ProtectedRoute>,
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