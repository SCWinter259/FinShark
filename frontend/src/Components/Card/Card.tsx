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
        <div className="card">
            <img
                alt="Company Logo"
            />
            <div className="details">
                <h2>{searchResult.name} ({id})</h2>
                <p>{searchResult.currency}</p>
            </div>
            <p className="info">
                {searchResult.exchange} - {searchResult.exchangeFullName}
            </p>
            <AddPortfolio onPortfolioCreate={onPortfolioCreate} symbol={id}/>
        </div>
    );
};

export default Card;