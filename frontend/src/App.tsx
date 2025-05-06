import {ChangeEvent, SyntheticEvent, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import CardList from "./Components/CardList/CardList.tsx";
import Search from "./Components/Search/Search.tsx";
import {CompanySearch} from "./Types/CompanySearch";
import {searchCompanies} from "./api.ts";
import ListPortfolio from "./Components/Portfolio/ListPortfolio/ListPortfolio.tsx";

function App() {
    const [search, setSearch] = useState<string>('');
    const [portfolioValues, setPortfolioValues] = useState<string[]>([]);
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
        console.log(result);
    }
    
    const onPortfolioCreate = (e: SyntheticEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;  // this will give us the form element
        const inputElement = form.elements[0] as HTMLInputElement; // gives us the first element in the form, which is the input
        // only add new value to the portfolio if it does not exist!
        const exists = portfolioValues.find((value) => inputElement.value === value);
        if(!exists) {
            const updatedPortfolio = [...portfolioValues, inputElement.value];
            setPortfolioValues(updatedPortfolio);   
        }
    }
    
    const onPortfolioDelete = (e: SyntheticEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;  // this will give us the form element
        const inputElement = form.elements[0] as HTMLInputElement; // gives us the first element in the form, which is the input
        // gives us the portfolioValues with the value removed.
        const removed = portfolioValues.filter((value) => {
            return value !== inputElement.value;
        });
        setPortfolioValues(removed);
    }

  return (
    <div className="App">
        <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange}/>
        <ListPortfolio portfolioValues={portfolioValues} onPortfolioDelete={onPortfolioDelete}/>
        <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate}/>
        {serverError && <div>Unable to connect to API</div>}
    </div>
  );
}

export default App;
