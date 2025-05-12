import {CompanyCashFlow} from "../../Types/CompanyCashFlow";
import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {getCashflowStatement} from "../../api.ts";
import Table from "../Table/Table.tsx";

interface Props {}

const config = [
    {
        label: "Date",
        render: (company: CompanyCashFlow) => company.date,
    },
    {
        label: "Operating Cashflow",
        render: (company: CompanyCashFlow) => company.operatingCashFlow,
    },
    {
        label: "Investing Cashflow",
        render: (company: CompanyCashFlow) =>
            company.netCashProvidedByInvestingActivities,
    },
    {
        label: "Financing Cashflow",
        render: (company: CompanyCashFlow) =>
            company.netCashProvidedByFinancingActivities,
    },
    {
        label: "Cash At End of Period",
        render: (company: CompanyCashFlow) => company.cashAtEndOfPeriod,
    },
    {
        label: "CapEX",
        render: (company: CompanyCashFlow) => company.capitalExpenditure,
    },
    {
        label: "Issuance Of Stock",
        render: (company: CompanyCashFlow) => company.netStockIssuance,
    },
    {
        label: "Free Cash Flow",
        render: (company: CompanyCashFlow) => company.freeCashFlow,
    },
];

const CashflowStatement = ({}: Props) => {
    const ticker = useOutletContext<string>();
    const [cashFlow, setCashFlow] = useState<CompanyCashFlow[]>();

    useEffect(() => {
        const fetchCashflow = async () => {
            const result = await getCashflowStatement(ticker);
            setCashFlow(result!.data);
        }
        fetchCashflow();
    }, []);
    
    return (
        <>
            { cashFlow ? (
                <Table config={config} data={cashFlow}/>
            ) : (
                <h1>No results!</h1>
            )}
        </>
    );
};

export default CashflowStatement;
