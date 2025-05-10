import {testIncomeStatementData} from "./testData.tsx";

const data = testIncomeStatementData;

type Company = (typeof data)[0];

interface Props {
    // data: Company[];
}

const configs = [
    {
        label: "Year",
        render: (company: Company) => company.acceptedDate
    },
    {
        label: "Cost of Revenue",
        render: (company: Company) => company.costOfRevenue
    }
];

const Table = ({}: Props) => {
    const renderedRows = data.map((company: Company) => {
        return (
            <tr key={company.cik}>
                {configs.map((val: any) => {
                    return (
                        <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                            {val.render(company)}
                        </td>
                    )
                })}
            </tr>
        )
    });
    
    const renderedHeaders = configs.map((config: any) => {
        return (
            <th className="p4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" key={config.label}>
                {config.label}
            </th>
        )
    })
    
    return (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8">
            <table>
                <thead className="min-w-full divide-y divide-gray-200 m-5">
                    {renderedHeaders}
                </thead>
                <tbody>{renderedRows}</tbody>
            </table>
        </div>
    );
};

export default Table;