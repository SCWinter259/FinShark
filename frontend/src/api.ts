import axios from 'axios';
import {CompanySearch} from "./Types/CompanySearch";
import {CompanyProfile} from "./Types/CompanyProfile";
import {CompanyKeyMetrics} from "./Types/CompanyKeyMetrics";

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

export const getCompanyProfile = async (query: string) => {
    try {
        const data = await axios.get<CompanyProfile[]>(
            `https://financialmodelingprep.com/stable/profile?symbol=${query}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
    }
}

export const getKeyMetrics = async (query: string) => {
    try {
        const data = await axios.get<CompanyKeyMetrics[]>(
            `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${query}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
    }
}