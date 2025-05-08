import "./Card.css";
import {CompanySearch} from "../../Types/CompanySearch";
import AddPortfolio from "../Portfolio/AddPortfolio/AddPortfolio.tsx";
import {SyntheticEvent} from "react";

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
            <h2 className="font-bold text-center text-veryDarkViolet md:text-left">
                {searchResult.name} ({searchResult.symbol})
            </h2>
            <p className="text-black">{searchResult.currency}</p>
            <p className="font-bold text-black">
                {searchResult.exchange} - {searchResult.exchangeFullName}
            </p>
            <AddPortfolio onPortfolioCreate={onPortfolioCreate} symbol={id}/>
        </div>
    );
};

export default Card;