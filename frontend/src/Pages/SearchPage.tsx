import Search from "../Components/Search.tsx";
import CardList from "../Components/CardList.tsx";
import {ChangeEvent, SyntheticEvent, useState} from "react";
import {CompanySearch} from "../Types/CompanySearch";
import {searchCompanies} from "../api.ts";
import {portfolioAddAPI} from "../Services/PortfolioService.ts";
import {toast} from "react-toastify";

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

    const onPortfolioCreate = async (e: SyntheticEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;  // this will give us the form element
        const inputElement = form.elements[0] as HTMLInputElement; // gives us the first element in the form, which is the input
        
        try {
            const res = await portfolioAddAPI(inputElement.value);
            if(res?.status === 201) {
                toast.success("Stock added to portfolio!")
            }
        } catch (error: any) {
            toast.error("Could not get portfolio items!");
            console.log(error.message);
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
                onPortfolioCreate={onPortfolioCreate}
            />
            {serverError && <div>Unable to connect to API</div>}
        </>
    );
};

export default SearchPage;
