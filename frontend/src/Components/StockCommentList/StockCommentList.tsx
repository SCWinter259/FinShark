import {CommentGet} from "../../Types/CommentGet";
import StockCommentListItem from "./StockCommentListItem/StockCommentLIstItem.tsx";

type Props = {
    comments: CommentGet[];
};

const StockCommentList = ({ comments }: Props) => {
    return (
        <>
            {comments
                ? comments.map((comment) => {
                    return <StockCommentListItem comment={comment} />;
                })
                : ""}
        </>
    );
};

export default StockCommentList;