import axios from 'axios';
import {CompanySearch} from "./Types/CompanySearch";
import {CompanyProfile} from "./Types/CompanyProfile";
import {CompanyKeyMetrics} from "./Types/CompanyKeyMetrics";
import {CompanyIncomeStatement} from "./Types/CompanyIncomeStatement";
import {CompanyBalanceSheet} from "./Types/CompanyBalanceSheet";
import {CompanyCashFlow} from "./Types/CompanyCashFlow";

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
        if(isAxiosError(error)) {
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

/*
* Gets the 5 most recent income statements from the company
*/
export const getIncomeStatement = async (query: string) => {
    try {
        const data = await axios.get<CompanyIncomeStatement[]>(
            `https://financialmodelingprep.com/stable/income-statement?symbol=${query}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
    }
}

/*
* Gets the 5 most recent balance sheets from the company
*/
export const getBalanceSheet = async (query: string) => {
    try {
        const data = await axios.get<CompanyBalanceSheet[]>(
            `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${query}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
    }
}


/*
* Gets the 5 most recent cashflow statements from the company
*/
export const getCashflowStatement = async (query: string) => {
    try {
        const data = await axios.get<CompanyCashFlow[]>(
            `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${query}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
    }
}