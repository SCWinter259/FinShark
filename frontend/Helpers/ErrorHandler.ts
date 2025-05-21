import axios from "axios";
import {toast} from "react-toastify";

export const handleError = (error: any) => {
    // @ts-ignore
    if(axios.isAxiosError(error)) {
        let err = error.response;
        
        if(Array.isArray(err?.data.errors)){
            // if error is an array
            for(let val of err?.data.errors) {
                toast.warning(val.description);
            }
        } else if (typeof err?.data.errors === 'object') {
            // if error is an object
            for(let e in err?.data.errors) {
                toast.warning(err.data.errors[e][0]);
            }
        } else if (err?.data) {
            // if there is any data in error
            toast.warning(err.data);
        } else if (err?.status === 401) {
            // authentication error
            toast.warning("Please login");
            window.history.pushState({}, "loginPage", "/login");
        } else if (err) {
            // all other errors
            toast.warning(err?.data);
        }
    }
}