import CardPortfolio from "../CardPortfolio/CardPortfolio.tsx";
import {SyntheticEvent} from "react";

interface Props {
    portfolioValues: string[];
    onPortfolioDelete: (e: SyntheticEvent) => void;
};

const ListPortfolio = ({portfolioValues, onPortfolioDelete}: Props) => {
    return (
      <>
        <h3>My Portfolio</h3>
          <ul>
              {portfolioValues && portfolioValues.map((portfolioValue: string) => {
                  return <CardPortfolio portfolioValue={portfolioValue} onPortfolioDelete={onPortfolioDelete}/>
              })}
          </ul>
      </>
    );
};

export default ListPortfolio;