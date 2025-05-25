import {ChangeEvent, useEffect, useRef, useState} from "react";
import {StockChartData} from "../Types/StockChartData";
import {getStockChartData} from "../api.ts";
import Spinner from "./Spinner/Spinner.tsx";
import {getStartDate} from "../Helpers/GetDates.ts";
import {createChart, ColorType, AreaSeries} from "lightweight-charts";

const chartStyle = {
    backgroundColor: 'white',
    lineGreenColor: '#4CAF50',
    lineRedColor: '#F44336',
    textColor: 'black',
    areaGreenTopColor: '#81C784',
    areaRedTopColor: '#E57373',
    areaGreenBottomColor: 'rgba(76, 175, 80, 0)',
    areaRedBottomColor: 'rgba(244, 67, 54, 0)',
}

const chartOptions = [
    '7 Days',
    '1 Month',
    '3 Months',
    '1 Year',
    '3 Years',
    '5 Years',
];

interface Props {
    ticker: string;
}

const Chart = ({ticker}: Props) => {
    const [stockData, setStockData] = useState<StockChartData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedChartOption, setSelectedChartOption] = useState<string>(chartOptions[0]);

    const chartContainerRef = useRef<any>(null);
    
    useEffect(() => {
        // call API for chart data
        getChartData();
    }, [selectedChartOption]);
    
    useEffect(() => {
        // create the chart object
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: chartStyle.backgroundColor, },
                textColor: chartStyle.textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        });
        chart.timeScale().fitContent();

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        };
        
        // get the data series in the right format and sort in ascending time order
        const sortedDataSeries = stockData.map((data: StockChartData) => (
            {time: data.date, value: data.price}
        )).sort((a, b) => a.time.localeCompare(b.time));

        // find if the chart does up or down (default to true)
        const isUp = stockData.length > 0 ? (sortedDataSeries[0].value <= sortedDataSeries[sortedDataSeries.length - 1].value) : true;
        
        // fill in the data
        const newSeries = chart.addSeries(AreaSeries, { 
            lineColor: isUp ? chartStyle.lineGreenColor : chartStyle.lineRedColor, 
            topColor: isUp ? chartStyle.areaGreenTopColor : chartStyle.areaRedTopColor, 
            bottomColor: isUp ? chartStyle.areaGreenBottomColor : chartStyle.areaRedBottomColor
        });
        
        newSeries.setData(sortedDataSeries);   // sort the data in ascending order

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove(); // remove a redundant chart
        };
    }, [stockData]);

    const getChartData = async () => {
        const result = await getStockChartData(ticker, getStartDate(selectedChartOption));
        console.log(result);
        if(typeof result === 'string') {
            setError(result);
        } else {
            setStockData(result.data);
        }
    }
    
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChartOption(event.target.value);
    }
    
    return (
        <div className="relative pt-20 bg-blueGray-100 w-full flex justify-center">
            <div className="relative flex flex-col w-full items-center p-8">
                <div className="w-full m-8" ref={chartContainerRef}/>
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
        </div>
    );
};

export default Chart;