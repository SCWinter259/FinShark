import Search from "../../Components/Search/Search.tsx";
import ListPortfolio from "../../Components/Portfolio/ListPortfolio/ListPortfolio.tsx";
import CardList from "../../Components/CardList/CardList.tsx";
import {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import {CompanySearch} from "../../Types/CompanySearch";
import {searchCompanies} from "../../api.ts";
import {PortfolioGet} from "../../Types/PortfolioGet";
import {portfolioAddAPI, portfolioDeleteAPI, portfolioGetAPI} from "../../Services/PortfolioService.ts";
import {toast} from "react-toastify";

interface Props {};

const SearchPage = ({}: Props) => {
    const [search, setSearch] = useState<string>('');
    const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>([]);
    const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        getPortfolio();
    }, []);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    
    const getPortfolio = () => {
        portfolioGetAPI().then((res) => {
            if(res?.data){
                setPortfolioValues(res?.data);
            }
        }).catch((e) => {
            toast.warning("Could not get portfolio values!");
            console.log(e.message);
        })
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

    const onPortfolioCreate = (e: SyntheticEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;  // this will give us the form element
        const inputElement = form.elements[0] as HTMLInputElement; // gives us the first element in the form, which is the input
        portfolioAddAPI(inputElement.value).then((res) => {
            if(res?.status === 204) {
                toast.success("Stock added to portfolio!")
                getPortfolio();
            }
        }).catch((e) => {
            toast.error("Could not get portfolio items!");
            console.log(e.message);
        })
    }

    const onPortfolioDelete = (e: SyntheticEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;  // this will give us the form element
        const inputElement = form.elements[0] as HTMLInputElement; // gives us the first element in the form, which is the input
        portfolioDeleteAPI(inputElement.value).then((res) => {
            if (res?.status == 200) {
                toast.success("Stock deleted from portfolio!");
                getPortfolio();
            }
        });
    }
    
    return (
        <>
            <Search
                onSearchSubmit={onSearchSubmit}
                search={search}
                handleSearchChange={handleSearchChange}
            />
            <ListPortfolio
                portfolioValues={portfolioValues!}
                onPortfolioDelete={onPortfolioDelete}
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
