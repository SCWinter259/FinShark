import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CompanyProfile} from "../Types/CompanyProfile";
import {getCompanyProfile} from "../api.ts";
import SideBar from "../Components/SideBar.tsx";
import CompanyDashboard from "../Components/CompanyDashboard.tsx";
import Tile from "../Components/Tile.tsx";
import Spinner from "../Components/Spinner/Spinner.tsx";
import {formatLargeNonMonetaryNumber} from "../Helpers/NumberFormatting.ts";

const CompanyPage = () => {
    const [company, setCompany] = useState<CompanyProfile>()
    let {ticker} = useParams<string>();

    useEffect(() => {
        const getProfileInit = async () => {
            const result = await getCompanyProfile(ticker!);
            setCompany(result?.data[0]);
        }
        getProfileInit();
    }, []);

    return (
        <>
            {company ? (
                <div className="w-full relative flex ct-docs-disable-sidebar-content overflow-x-hidden">
                    <SideBar/>
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
            ) : (
                <Spinner/>
            )}
        </>
    );
};

export default CompanyPage;
