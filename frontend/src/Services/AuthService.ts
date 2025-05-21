import axios from "axios";
import {handleError} from "../../Helpers/ErrorHandler.ts";
import {UserProfileToken} from "../Types/UserProfileToken";

const api = "http://localhost:5137/api";

export const loginAPI = async (username: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "account/login", {
            username: username,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}

export const registerAPI = async (email: string, username: string, password: string) => {
    try {
        const data = await axios.post<UserProfileToken>(api + "account/register", {
            email: email,
            username: username,
            password: password,
        });
        return data;
    } catch (error) {
        handleError(error);
    }
}
