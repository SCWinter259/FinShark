import {CompanyIncomeStatement} from "../../Types/CompanyIncomeStatement";
import {useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import {getIncomeStatement} from "../../api.ts";
import Table from "../Table/Table.tsx";

interface Props {};

const configs = [
    {
        label: "Date",
        render: (company: CompanyIncomeStatement) => company.date,
    },
    {
        label: "Revenue",
        render: (company: CompanyIncomeStatement) => company.revenue,
    },
    {
        label: "Cost Of Revenue",
        render: (company: CompanyIncomeStatement) => company.costOfRevenue,
    },
    {
        label: "Depreciation",
        render: (company: CompanyIncomeStatement) =>
            company.depreciationAndAmortization,
    },
    {
        label: "Operating Income",
        render: (company: CompanyIncomeStatement) => company.operatingIncome,
    },
    {
        label: "Income Before Taxes",
        render: (company: CompanyIncomeStatement) => company.incomeBeforeTax,
    },
    {
        label: "Net Income",
        render: (company: CompanyIncomeStatement) => company.netIncome,
    },
    {
        label: "Earnings Per Share",
        render: (company: CompanyIncomeStatement) => company.eps,
    },
    {
        label: "Earnings Per Diluted",
        render: (company: CompanyIncomeStatement) => company.epsDiluted,
    },
];

const IncomeStatement = ({}: Props) => {
    const ticker = useOutletContext<string>();
    const [incomeStatement, setIncomeStatement] = useState<CompanyIncomeStatement[]>();

    useEffect(() => {
        const incomeStatementFetch = async () => {
            const result = await getIncomeStatement(ticker);
            setIncomeStatement(result!.data);
        }
        incomeStatementFetch();
    }, []);
    
    return (
        <>
            {incomeStatement ? <Table config={configs} data={incomeStatement}/> : <>Loading...</>}
        </>
    );
};

export default IncomeStatement;
