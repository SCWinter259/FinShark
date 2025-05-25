import axios from 'axios';
import {CompanySearch} from "./Types/CompanySearch";
import {CompanyProfile} from "./Types/CompanyProfile";
import {CompanyKeyMetrics} from "./Types/CompanyKeyMetrics";
import {CompanyIncomeStatement} from "./Types/CompanyIncomeStatement";
import {CompanyBalanceSheet} from "./Types/CompanyBalanceSheet";
import {CompanyCashFlow} from "./Types/CompanyCashFlow";
import {StockChartData} from "./Types/StockChartData";
import {getToday} from "./Helpers/GetDates.ts";

interface SearchResponse {
    data: CompanySearch[];
}

export const searchCompanies = async (symbol: string) => {
    try {
        const data = await axios.get<SearchResponse>(
            `https://financialmodelingprep.com/stable/search-symbol?query=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}

export const getCompanyProfile = async (symbol: string) => {
    try {
        const data = await axios.get<CompanyProfile[]>(
            `https://financialmodelingprep.com/stable/profile?symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}

export const getKeyMetrics = async (symbol: string) => {
    try {
        const data = await axios.get<CompanyKeyMetrics[]>(
            `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}

/*
* Gets the 5 most recent income statements from the company
*/
export const getIncomeStatement = async (symbol: string) => {
    try {
        const data = await axios.get<CompanyIncomeStatement[]>(
            `https://financialmodelingprep.com/stable/income-statement?symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}

/*
* Gets the 5 most recent balance sheets from the company
*/
export const getBalanceSheet = async (symbol: string) => {
    try {
        const data = await axios.get<CompanyBalanceSheet[]>(
            `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}


/*
* Gets the 5 most recent cashflow statements from the company
*/
export const getCashflowStatement = async (symbol: string) => {
    try {
        const data = await axios.get<CompanyCashFlow[]>(
            `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=${symbol}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}

export const getStockChartData = async (symbol: string, from: string) => {
    try {
        const data = await axios.get<StockChartData[]>(
            `https://financialmodelingprep.com/stable/historical-price-eod/light?symbol=${symbol}&from=${from}&to=${getToday()}&apikey=${import.meta.env.VITE_API_KEY}`
        );
        return data;
    } catch (error: any) {
        console.log("error message:", error.message);
        if(error.status === 402) {
            return "Oops, your API subscription is too cheap for this information";
        } else if (error.status === 429) {
            return "You have hit the API call limit!"
        }
        return "An unexpected error has occurred";
    }
}