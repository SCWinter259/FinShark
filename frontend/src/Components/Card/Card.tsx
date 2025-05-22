import {CompanySearch} from "../../Types/CompanySearch";
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio.tsx";
import {SyntheticEvent} from "react";
import {Link} from "react-router-dom";

interface Props {
    id: string;
    searchResult: CompanySearch;
    onPortfolioCreate: (e: SyntheticEvent) => void;
}

const Card = ({id, searchResult, onPortfolioCreate}: Props) => {
    return (
        <div
            className="flex flex-col items-center justify-between w-full p-6 bg-slate-100 rounded-lg md:flex-row"
            key={id}
            id={id}
        >
            <Link to={`/company/${searchResult.symbol}/company-profile`} className="text-center text-veryDarkViolet md:text-left">
                <p className="font-bold">{searchResult.symbol} - {searchResult.name}</p>
                <p className="italic">
                    {searchResult.exchange} - {searchResult.exchangeFullName} ({searchResult.currency})
                </p>
            </Link>
            <AddPortfolio onPortfolioCreate={onPortfolioCreate} symbol={id}/>
        </div>
    );
};

export default Card;