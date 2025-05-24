import {ChangeEvent, useEffect, useRef, useState} from "react";
import {StockChartData} from "../Types/StockChartData";
import {getStockChartData} from "../api.ts";
import Spinner from "./Spinner/Spinner.tsx";
import {getStartDate} from "../Helpers/GetDates.ts";
import {createChart, ColorType, AreaSeries} from "lightweight-charts";

const chartStyle = {
    backgroundColor: 'white',
    lineColor: '#2962FF',
    textColor: 'black',
    areaTopColor: '#2962FF',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)',
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
        
        // fill in the data
        const newSeries = chart.addSeries(AreaSeries, { 
            lineColor: chartStyle.lineColor, 
            topColor: chartStyle.areaTopColor, 
            bottomColor: chartStyle.areaBottomColor
        });
        
        newSeries.setData(stockData.map((data: StockChartData) => (
            {time: data.date, value: data.price}
        )).sort((a, b) => a.time.localeCompare(b.time)));   // sort the data in ascending order

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove(); // remove a redundant chart
            if(!stockData) chart.remove();  // remove out actual chart if there is no data
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
    
    return (stockData ? (
        <div className="relative pt-20 bg-blueGray-100 w-full flex justify-center">
            <div className="relative flex flex-col w-full items-center p-8">
                <div ref={chartContainerRef}></div>
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
    ) : (
        error ? <div className="m-auto font-semibold">{error}</div> : <Spinner/>
        )
    );
};

export default Chart;