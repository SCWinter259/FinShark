import {CompanySearch} from "../Types/CompanySearch";
import {Link} from "react-router-dom";
import {portfolioAddAPI} from "../Services/PortfolioService.ts";
import {toast} from "react-toastify";

interface Props {
    searchResult: CompanySearch;
}

const SearchItemCard = ({searchResult}: Props) => {
    const onPortfolioCreate = async () => {
        try {
            const res = await portfolioAddAPI(searchResult.symbol);
            if(res?.status === 201) {
                toast.success("Stock added to portfolio!")
            }
        } catch (error: any) {
            toast.error("Could not get portfolio items!");
            console.log(error.message);
        }
    }
    
    return (
        <div
            className="flex flex-col items-center justify-between w-full p-6 bg-slate-100 rounded-lg md:flex-row"
            key={searchResult.symbol}
            id={searchResult.symbol}
        >
            <Link to={`/company/${searchResult.symbol}/company-profile`} className="text-center text-veryDarkViolet md:text-left">
                <p className="font-bold">{searchResult.symbol} - {searchResult.name}</p>
                <p className="italic">
                    {searchResult.exchange} - {searchResult.exchangeFullName} ({searchResult.currency})
                </p>
            </Link>
            <div className="flex flex-col items-center justify-end flex-1 space-x-4 space-y-2 md:flex-row md:space-y-0">
                <button
                    className="p-2 px-8 text-white bg-darkBlue rounded-lg hover:opacity-70 focus:outline-none"
                    onClick={onPortfolioCreate}
                >
                    Add
                </button>
            </div>
        </div>
    );
};

export default SearchItemCard;