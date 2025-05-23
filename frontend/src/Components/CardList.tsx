import {CompanySearch} from "../Types/CompanySearch";
import {v4 as uuidv4} from "uuid"; // we need uuid generated for the cards because stock symbol is not guaranteed to be unique
import SearchItemCard from "./SearchItemCard.tsx";

interface Props {
    searchResults: CompanySearch[];
}

const CardList = ({searchResults}: Props) => {
    return (
        <>
            {searchResults.length > 0 ? (
                searchResults.map((result) => {
                    return <SearchItemCard key={uuidv4()} searchResult={result}/>
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