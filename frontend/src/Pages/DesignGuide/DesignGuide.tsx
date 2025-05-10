import Table from "../../Components/Table/Table.tsx";
import RatioList from "../../Components/RatioList/RatioList.tsx";

interface Props {};

const DesignPage = ({}: Props) => {
    return (
        <>
            <RatioList/>
            <Table/>
        </>
    );
};

export default DesignPage;
