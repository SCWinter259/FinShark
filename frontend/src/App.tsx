import {ChangeEvent, SyntheticEvent, useState} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import CardList from "./Components/CardList/CardList.tsx";
import Search from "./Components/Search/Search.tsx";
import {CompanySearch} from "./Types/CompanySearch";
import {searchCompanies} from "./api.ts";

function App() {
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
        console.log(result);
    }
    
    const onPortfolioCreate = async (e: SyntheticEvent) => {
        e.preventDefault();
        console.log(e);
    }

  return (
    <div className="App">
        <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange}/>
        <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate}/>
        {serverError && <div>Unable to connect to API</div>}
    </div>
  );
}

export default App;
