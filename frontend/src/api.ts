import axios from 'axios';
import {CompanySearch} from "./Types/CompanySearch";

interface SearchResponse {
    data: CompanySearch[];
}

export const searchCompanies = async (query: string) => {
    try {
        const data = await axios.get<SearchResponse>(
            `https://financialmodelingprep.com/stable/search-symbol?query=${query}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        // I have to ignore the following error because I believe it is a Vite linting problem.
        // @ts-ignore
        if(axios.isAxiosError(error)) {
            console.log("error message:", error.message);
            return error.message;
        } else {
            console.log("unexpected error");
            return "An unexpected error has occurred";
        }
    }
}