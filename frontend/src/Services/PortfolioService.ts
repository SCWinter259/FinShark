import axios from "axios";
import {PortfolioGet} from "../Types/PortfolioGet";
import {PortfolioPost} from "../Types/PortfolioPost";
import {handleError} from "../../Helpers/ErrorHandler.ts";

const api = "https://finshark-gfhvfzgpd6gvgngf.canadacentral-01.azurewebsites.net/api/portfolio/";

export const portfolioAddAPI = async (symbol: string) => {
    try {
        const data = await axios.post<PortfolioPost>(api + `?symbol=${symbol}`);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const portfolioDeleteAPI = async (symbol: string) => {
    try {
        const data = await axios.delete<PortfolioPost>(api + `?symbol=${symbol}`);
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const portfolioGetAPI = async () => {
    try {
        const data = await axios.get<PortfolioGet[]>(api);
        return data;
    } catch (error) {
        handleError(error);
    }
};