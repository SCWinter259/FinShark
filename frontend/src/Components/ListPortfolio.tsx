import {PortfolioGet} from "../Types/PortfolioGet";
import {v4 as uuidv4} from "uuid";
import PortfolioItemCard from "./PortfolioItemCard.tsx";

interface Props {
    portfolioValues: PortfolioGet[];
}

const ListPortfolio = ({portfolioValues}: Props) => {
    return (
        <section id="portfolio">
            <h2 className="mb-3 mt-3 text-3xl font-semibold text-center md:text-4xl">
                My Portfolio
            </h2>
            <div>
                {portfolioValues.length > 0 ? (
                    portfolioValues.map((portfolioValue: PortfolioGet) => {
                        return (
                            <PortfolioItemCard key={uuidv4()} portfolioValue={portfolioValue}/>
                        );
                    })
                ) : (
                    <h3 className="mb-3 mt-3 text-xl font-semibold text-center md:text-xl">
                        Your portfolio is empty.
                    </h3>
                )}
            </div>
        </section>
    );
};

export default ListPortfolio;