import {ChangeEvent, SyntheticEvent} from "react";

interface Props {
    search: string | undefined;
    onSearchSubmit: (e: SyntheticEvent) => void;
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Search = ({search, onSearchSubmit, handleSearchChange}: Props) => {
    return (
        <>
            <form onSubmit={onSearchSubmit}>
                <input value={search} onChange={handleSearchChange}/>
            </form>
        </>
    );
}

export default Search;