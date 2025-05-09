import {createBrowserRouter} from "react-router-dom";
import App from '../App.tsx';
import HomePage from "../Pages/HomePage/HomePage.tsx";
import SearchPage from "../Pages/SearchPage/SearchPage.tsx";
import CompanyPage from "../Pages/CompanyPage/CompanyPage.tsx";
import CompanyProfile from "../Components/CompanyProfile/CompanyProfile.tsx";
import IncomeStatement from "../Components/IncomeStatement/IncomeStatement.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: "search", element: <SearchPage/>},
            {path: "company/:ticker", element: <CompanyPage/>,
                children: [
                    {path: "company-profile", element: <CompanyProfile/>},
                    {path: "income-statement", element: <IncomeStatement/>}
                ]
            }
        ]
    }
]);