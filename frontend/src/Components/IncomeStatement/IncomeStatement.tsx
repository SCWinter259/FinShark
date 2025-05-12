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
        subtitle: ""
    },
    {
        label: "Revenue",
        render: (company: CompanyIncomeStatement) => company.revenue,
        subtitle: ""
    },
    {
        label: "Cost Of Revenue",
        render: (company: CompanyIncomeStatement) => company.costOfRevenue,
        subtitle: ""
    },
    {
        label: "Depreciation",
        render: (company: CompanyIncomeStatement) =>
            company.depreciationAndAmortization,
        subtitle: ""
    },
    {
        label: "Operating Income",
        render: (company: CompanyIncomeStatement) => company.operatingIncome,
        subtitle: ""
    },
    {
        label: "Income Before Taxes",
        render: (company: CompanyIncomeStatement) => company.incomeBeforeTax,
        subtitle: ""
    },
    {
        label: "Net Income",
        render: (company: CompanyIncomeStatement) => company.netIncome,
        subtitle: ""
    },
    {
        label: "Earnings Per Share",
        render: (company: CompanyIncomeStatement) => company.eps,
        subtitle: ""
    },
    {
        label: "Earnings Per Diluted",
        render: (company: CompanyIncomeStatement) => company.epsDiluted,
        subtitle: ""
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
