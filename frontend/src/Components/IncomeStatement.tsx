import {CompanyIncomeStatement} from "../Types/CompanyIncomeStatement";
import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {getIncomeStatement} from "../api.ts";
import Table from "./Table.tsx";
import Spinner from "./Spinner/Spinner.tsx";
import {formatLargeMonetaryNumber, formatRatio} from "../Helpers/NumberFormatting.ts";

const configs = [
    {
        label: "Date",
        render: (company: CompanyIncomeStatement) => company.date,
    },
    {
        label: "Revenue",
        render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.revenue),
    },
    {
        label: "Cost Of Revenue",
        render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.costOfRevenue),
    },
    {
        label: "Depreciation",
        render: (company: CompanyIncomeStatement) =>
            formatLargeMonetaryNumber(company.depreciationAndAmortization),
    },
    {
        label: "Operating Income",
        render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.operatingIncome),
    },
    {
        label: "Income Before Taxes",
        render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.incomeBeforeTax),
    },
    {
        label: "Net Income",
        render: (company: CompanyIncomeStatement) => formatLargeMonetaryNumber(company.netIncome),
    },
    {
        label: "Earnings Per Share",
        render: (company: CompanyIncomeStatement) => formatRatio(company.eps),
    },
    {
        label: "Earnings Per Diluted",
        render: (company: CompanyIncomeStatement) => formatRatio(company.epsDiluted),
    },
];

const IncomeStatement = () => {
    const ticker = useOutletContext<string>();
    const [incomeStatement, setIncomeStatement] = useState<CompanyIncomeStatement[]>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const incomeStatementFetch = async () => {
            const result = await getIncomeStatement(ticker);
            if(typeof result === 'string') {
                setError(result);
            } else {
                setIncomeStatement(result.data);
            }
        }
        incomeStatementFetch();
    }, []);
    
    return (
        <>
            {incomeStatement ? (
                <Table config={configs} data={incomeStatement}/>
            ) : (
                error ? <div className="m-auto font-semibold">{error}</div> : <Spinner/>
            )}
        </>
    );
};

export default IncomeStatement;
