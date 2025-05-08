import Card from "../Card/Card.tsx";
import {CompanySearch} from "../../Types/CompanySearch";
import {v4 as uuidv4} from "uuid";
import {SyntheticEvent} from "react";  // we need uuid generated for the cards because stock symbol is not guaranteed to be unique

interface Props {
    searchResults: CompanySearch[];
    onPortfolioCreate: (e: SyntheticEvent) => void;
}

const CardList = ({searchResults, onPortfolioCreate}: Props) => {
    return (
        <>
            {searchResults.length > 0 ? (
                searchResults.map((result) => {
                    return <Card id={result.symbol} key={uuidv4()} searchResult={result} onPortfolioCreate={onPortfolioCreate}/>;
                })
            ) : (
                <p className="mb-3 mt-3 text-xl font-semibold text-center md:text-xl">
                    No results!
                </p>
            )}
        </>
    );
}

export default CardList;