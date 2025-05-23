import {Outlet} from "react-router-dom";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
    ticker: string;
}

const CompanyDashboard = ({children, ticker}: Props) => {
    return (
            <div className="relative pt-8 pb-32 bg-lightBlue-500">
                <div className="px-4 md:px-6 mx-auto w-full">
                    <div>
                        <div className="flex flex-wrap">
                            {children}
                        </div>
                        <div className="flex flex-wrap">
                            {<Outlet context={ticker}/>}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default CompanyDashboard;
