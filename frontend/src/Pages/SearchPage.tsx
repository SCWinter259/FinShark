import Search from "../Components/Search.tsx";
import CardList from "../Components/CardList.tsx";
import {ChangeEvent, SyntheticEvent, useState} from "react";
import {CompanySearch} from "../Types/CompanySearch";
import {searchCompanies} from "../api.ts";

const SearchPage = () => {
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const onSearchSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
        const result = await searchCompanies(search);
        if(typeof result === 'string') {
            setServerError(result);
        } else if(Array.isArray(result.data)) {
            setSearchResult(result.data);
        }
    }
    
    return (
        <>
            <Search
                onSearchSubmit={onSearchSubmit}
                search={search}
                handleSearchChange={handleSearchChange}
            />
            <CardList
                searchResults={searchResult}
            />
            {serverError && <div className="m-auto font-semibold">{serverError}</div>}
        </>
    );
};

export default SearchPage;
