import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {CompanyProfile} from "../../Types/CompanyProfile";
import {getCompanyProfile} from "../../api.ts";

interface Props {};

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
                <div>{company.companyName}</div>
            ) : (
                <div>Company not found</div>
            )}
        </>
    );
};

export default CompanyPage;
