import {CompanyCashFlow} from "../Types/CompanyCashFlow";
import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {getCashflowStatement} from "../api.ts";
import Table from "./Table.tsx";
import Spinner from "./Spinner/Spinner.tsx";
import {formatLargeMonetaryNumber} from "../Helpers/NumberFormatting.ts";

const config = [
    {
        label: "Date",
        render: (company: CompanyCashFlow) => company.date,
    },
    {
        label: "Operating Cashflow",
        render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.operatingCashFlow),
    },
    {
        label: "Investing Cashflow",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.netCashProvidedByInvestingActivities),
    },
    {
        label: "Financing Cashflow",
        render: (company: CompanyCashFlow) =>
            formatLargeMonetaryNumber(company.netCashProvidedByFinancingActivities),
    },
    {
        label: "Cash At End of Period",
        render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.cashAtEndOfPeriod),
    },
    {
        label: "CapEX",
        render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.capitalExpenditure),
    },
    {
        label: "Issuance Of Stock",
        render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.netStockIssuance),
    },
    {
        label: "Free Cash Flow",
        render: (company: CompanyCashFlow) => formatLargeMonetaryNumber(company.freeCashFlow),
    },
];

const CashflowStatement = () => {
    const ticker = useOutletContext<string>();
    const [cashFlow, setCashFlow] = useState<CompanyCashFlow[]>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCashflow = async () => {
            const result = await getCashflowStatement(ticker);
            if(typeof result === 'string') {
                setError(result);
            } else {
                setCashFlow(result.data);
            }
        }
        fetchCashflow();
    }, []);
    
    return (
        <>
            { cashFlow ? (
                <Table config={config} data={cashFlow}/>
            ) : (
                error ? <div className="m-auto font-semibold">{error}</div> : <Spinner/>
            )}
        </>
    );
};

export default CashflowStatement;
