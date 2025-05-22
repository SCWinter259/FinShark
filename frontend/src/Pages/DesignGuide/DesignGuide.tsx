import Table from "../../Components/Table/Table.tsx";
import RatioList from "../../Components/RatioList/RatioList.tsx";
import {CompanyKeyMetrics} from "../../Types/CompanyKeyMetrics";
import {testIncomeStatementData} from "../../Components/Table/testData.tsx";

const tableConfig = [
    {
        label: "Market Cap",
        render: (company: CompanyKeyMetrics) => company.marketCap,
        subtitle: "Total value of all a company's shares of stock",
    },
    {
        label: "Current Ratio",
        render: (company: CompanyKeyMetrics) => company.currentRatioTTM,
        subtitle:
            "Measures the companies ability to pay short term debt obligations",
    },
    {
        label: "Return On Equity",
        render: (company: CompanyKeyMetrics) => company.returnOnEquityTTM,
        subtitle:
            "Return on equity is the measure of a company's net income divided by its shareholder's equity",
    },
    {
        label: "Return On Assets",
        render: (company: CompanyKeyMetrics) => company.returnOnTangibleAssetsTTM,
        subtitle:
            "Return on assets is the measure of how effective a company is using its assets",
    },
    {
        label: "Graham Number",
        render: (company: CompanyKeyMetrics) => company.grahamNumberTTM,
        subtitle:
            "This is the upperbound of the price range that a defensive investor should pay for a stock",
    },
];

const DesignPage = () => {
    return (
        <>
            <RatioList data={testIncomeStatementData} config={tableConfig}/>
            <Table data={testIncomeStatementData} config={tableConfig}/>
        </>
    );
};

export default DesignPage;
