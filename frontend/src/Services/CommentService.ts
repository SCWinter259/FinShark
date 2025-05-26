import axios from "axios";
import {CommentGet} from "../Types/CommentGet";
import {CommentPost} from "../Types/CommentPost";
import { handleError } from "../../Helpers/ErrorHandler.ts";

const api = "https://finshark-gfhvfzgpd6gvgngf.canadacentral-01.azurewebsites.net/api/comment/";

export const commentPostAPI = async (
    title: string,
    content: string,
    symbol: string
) => {
    try {
        const data = await axios.post<CommentPost>(api + `${symbol}`, {
            title: title,
            content: content,
        });
        return data;
    } catch (error) {
        handleError(error);
    }
};

export const commentGetAPI = async (symbol: string) => {
    try {
        const data = await axios.get<CommentGet[]>(api + `?Symbol=${symbol}`);
        return data;
    } catch (error) {
        handleError(error);
    }
};