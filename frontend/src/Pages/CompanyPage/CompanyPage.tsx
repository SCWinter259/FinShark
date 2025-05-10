import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CompanyProfile} from "../../Types/CompanyProfile";
import {getCompanyProfile} from "../../api.ts";
import SideBar from "../../Components/SideBar/SideBar.tsx";
import CompanyDashboard from "../../Components/CompanyDashboard/CompanyDashboard.tsx";
import Tile from "../../Components/Tile/Tile.tsx";

interface Props {
};

const CompanyPage = ({}: Props) => {
    const [company, setCompany] = useState<CompanyProfile>()
    let {ticker} = useParams();

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
                    </CompanyDashboard>
                </div>
            ) : (
                <div>Company not found</div>
            )}
        </>
    );
};

export default CompanyPage;
