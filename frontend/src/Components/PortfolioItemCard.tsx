import {PortfolioGet} from "../Types/PortfolioGet";
import {Link} from "react-router-dom";
import {portfolioDeleteAPI} from "../Services/PortfolioService.ts";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {deletePortfolioValue} from "../Redux/Slices/portfolioSlice.ts";

interface Props {
    portfolioValue: PortfolioGet;
}

const PortfolioItemCard = ({portfolioValue}: Props) => {
    const dispatch = useDispatch();
    
    const onPortfolioDelete = async () => {
        try {
            const res = await portfolioDeleteAPI(portfolioValue.symbol);
            if (res?.status == 200) {
                toast.success("Stock deleted from portfolio!");
                // this changes the global state, forcing the portfolio page to re-render
                dispatch(deletePortfolioValue(portfolioValue));
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }
    
    return (
        <div
            className="flex flex-col items-center justify-between w-full p-6 bg-slate-100 rounded-lg md:flex-row"
            key={portfolioValue.symbol}
            id={portfolioValue.symbol}
        >
            <Link to={`/company/${portfolioValue.symbol}/company-profile`} className="text-center text-veryDarkViolet md:text-left">
                <p className="font-bold">{portfolioValue.symbol} - {portfolioValue.companyName}</p>
                <p className="italic">
                    {portfolioValue.industry}
                </p>
            </Link>
            <div className="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
                <button
                    className="p-2 px-8 text-white bg-darkBlue rounded-lg hover:opacity-70 focus:outline-none"
                    onClick={onPortfolioDelete}
                >
                    Remove
                </button>
            </div>
        </div>
    );
};

export default PortfolioItemCard;