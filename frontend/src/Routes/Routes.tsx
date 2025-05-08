import {createBrowserRouter} from "react-router-dom";
import App from '../App.tsx';
import HomePage from "../Pages/HomePage/HomePage.tsx";
import SearchPage from "../Pages/SearchPage/SearchPage.tsx";
import CompanyPage from "../Pages/CompanyPage/CompanyPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: "search", element: <SearchPage/>},
            {path: "company/:ticker", element: <CompanyPage/>}
        ]
    }
]);