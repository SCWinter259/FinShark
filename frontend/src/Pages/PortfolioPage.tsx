import {useEffect} from "react";
import {portfolioGetAPI} from "../Services/PortfolioService.ts";
import {toast} from "react-toastify";
import ListPortfolio from "../Components/ListPortfolio.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../Redux/store.ts";
import {setPortfolioValues} from "../Redux/Slices/portfolioSlice.ts";

const PortfolioPage = () => {
    const portfolioValues = useSelector((state: RootState) => state.portfolio.portfolioValues);
    const dispatch = useDispatch();

    // get the user portfolio
    useEffect(() => {
        getPortfolio();
    }, []);

    const getPortfolio = async () => {
        try {
            const res = await portfolioGetAPI();
            if(res?.data){
                dispatch(setPortfolioValues(res?.data));
            }
        } catch (error: any) {
            toast.warning("Could not get portfolio values!");
            console.log(error.message);
        }
    }
    
    return (
        <ListPortfolio portfolioValues={portfolioValues!}/>
    );
};

export default PortfolioPage;