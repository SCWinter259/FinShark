import axios from 'axios';
import {UserProfile} from "../src/Types/UserProfile";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {loginAPI, registerAPI} from "../src/Services/AuthService";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {resetPortfolioValues} from "../src/Redux/Slices/portfolioSlice.ts";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (email: string, username: string, password: string) => void;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}

type Props = { children: ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({children}: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        // every time this provider is invoked, we reach into the local storage to
        // get the user and the token
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            // axios is gonna add this to every future requests
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        }
        setIsReady(true);
    }, []);

    const registerUser = async (email: string, username: string, password: string) => {
        await registerAPI(email, username, password).then((res) => {
            if (res) {
                localStorage.setItem("token", res?.data.token);
                const userObj = {
                    userName: res?.data.userName,
                    email: res?.data.email,
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(userObj!);
                toast.success("Login Success!");
                navigate("/search");
            }
        })
    }

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password)
            .then((res) => {
                if (res) {
                    localStorage.setItem("token", res?.data.token);
                    const userObj = {
                        userName: res?.data.userName,
                        email: res?.data.email,
                    };
                    localStorage.setItem("user", JSON.stringify(userObj));
                    setToken(res?.data.token!);
                    setUser(userObj!);
                    toast.success("Login Success!");
                    navigate("/search");
                }
            })
            .catch((e) => {
                toast.warning("Server error occured")
                console.log(e.message);
            });
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        dispatch(resetPortfolioValues());
        navigate("/");
    };

    return (
        <UserContext.Provider
            value={{loginUser, user, token, logout, isLoggedIn, registerUser}}
        >
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);