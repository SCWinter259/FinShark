import {SyntheticEvent} from "react";
import DeletePortfolio from "../DeletePortfolio/DeletePortfolio.tsx";

interface Props {
    portfolioValue: string;
    onPortfolioDelete: (e: SyntheticEvent) => void;
};

const CardPortfolio = ({portfolioValue, onPortfolioDelete}: Props) => {
    return (
        <>
            <h4>{portfolioValue}</h4>
            <DeletePortfolio onPortfolioDelete={onPortfolioDelete} portfolioValue={portfolioValue}/>
        </>
    );
};

export default CardPortfolio;