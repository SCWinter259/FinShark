import {useParams} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";
import {CompanyProfile} from "../Types/CompanyProfile";
import {getCompanyProfile, getStockChartData} from "../api.ts";
import SideBar from "../Components/SideBar.tsx";
import CompanyDashboard from "../Components/CompanyDashboard.tsx";
import Tile from "../Components/Tile.tsx";
import Spinner from "../Components/Spinner/Spinner.tsx";
import {formatLargeNonMonetaryNumber} from "../Helpers/NumberFormatting.ts";
import {StockChartData} from "../Types/StockChartData";

const chartOptions = [
    '7 Days',
    '1 Month',
    '1 Year',
    '3 Years',
    '5 Years',
    'All Time'
]

const CompanyPage = () => {
    const [company, setCompany] = useState<CompanyProfile>();
    const [stockData, setStockData] = useState<StockChartData[]>();
    const [error, setError] = useState<string | null>(null);
    const [selectedChartOption, setSelectedChartOption] = useState<string>(chartOptions[0]);
    let {ticker} = useParams<string>();

    useEffect(() => {
        const getChart = async () => {
            const result = await getStockChartData(ticker!);
            if(typeof result === 'string') {
                setError(result);
            } else {
                setStockData(result.data);
                console.log(result.data);
            }
        }
        // getChart();
        
        const getProfileInit = async () => {
            const result = await getCompanyProfile(ticker!);
            if(typeof result === 'string') {
                setError(result);
            } else {
                setCompany(result.data[0]);
            }
        }
        getProfileInit();
    }, []);
    
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChartOption(event.target.value);
    }

    return (
        <>
            {company ? (
                <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
                    <SideBar/>
                    <div className="flex-col relative md:ml-64 bg-blueGray-100 w-full">
                        <div className="relative pt-20 bg-blueGray-100 w-full flex justify-center">
                            <select
                                value={selectedChartOption}
                                onChange={handleSelectChange}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {chartOptions.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <CompanyDashboard ticker={ticker!}>
                            <Tile title="Company Name" subtitle={company.companyName}/>
                            <Tile title="Price" subtitle={"$" + company.price.toString()}/>
                            <Tile title="Sector" subtitle={company.sector}/>
                            <Tile title="Average Volume" subtitle={formatLargeNonMonetaryNumber(company.averageVolume)}/>
                            <p className="bg-white shadow rounded text-medium text-gray-900 p-3 mt-1 m-4">
                                {company.description}
                            </p>
                        </CompanyDashboard>
                    </div>
                </div>
            ) : (
                error ? <div className="m-auto font-semibold">{error}</div> : <Spinner/>
            )}
        </>
    );
};

export default CompanyPage;
