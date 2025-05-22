import {CompanyKeyMetrics} from "../../Types/CompanyKeyMetrics";
import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {getKeyMetrics} from "../../api.ts";
import RatioList from "../RatioList/RatioList.tsx";
import Spinner from "../Spinner/Spinner.tsx";
import {formatLargeNonMonetaryNumber, formatRatio} from "../../Helpers/NumberFormatting.ts";
import StockComment from "../StockComment/StockComment.tsx";

const tableConfig = [
    {
        label: "Market Cap",
        render: (company: CompanyKeyMetrics) => formatLargeNonMonetaryNumber(company.marketCap),
        subtitle: "Total value of all a company's shares of stock",
    },
    {
        label: "Current Ratio",
        render: (company: CompanyKeyMetrics) => formatRatio(company.currentRatioTTM),
        subtitle:
            "Measures the companies ability to pay short term debt obligations",
    },
    {
        label: "Return On Equity",
        render: (company: CompanyKeyMetrics) => formatRatio(company.returnOnEquityTTM),
        subtitle:
            "Return on equity is the measure of a company's net income divided by its shareholder's equity",
    },
    {
        label: "Return On Assets",
        render: (company: CompanyKeyMetrics) => formatRatio(company.returnOnTangibleAssetsTTM),
        subtitle:
            "Return on assets is the measure of how effective a company is using its assets",
    },
    {
        label: "Graham Number",
        render: (company: CompanyKeyMetrics) => formatRatio(company.grahamNumberTTM),
        subtitle:
            "This is the upperbound of the price range that a defensive investor should pay for a stock",
    },
];

export const CompanyProfile = () => {
    const ticker = useOutletContext<string>();
    const [companyData, setCompanyData] = useState<CompanyKeyMetrics>();

    useEffect(() => {
        const getCompanyKeyMetrics = async () => {
            const value = await getKeyMetrics(ticker);
            setCompanyData(value?.data[0]);
        }
        getCompanyKeyMetrics();
    }, []);
    
    return (
        <>
            { companyData ? (
                <>
                    <RatioList config={tableConfig} data={companyData}/>
                    <StockComment stockSymbol={ticker}/>
                </>
            ) : (
                <Spinner/>
            )}
        </>
    );
};

export default CompanyProfile;
