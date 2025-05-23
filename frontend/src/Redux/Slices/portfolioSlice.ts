import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PortfolioGet} from "../../Types/PortfolioGet";

interface PortfolioState {
    portfolioValues: PortfolioGet[] | null
}

const initialState: PortfolioState = {
    portfolioValues: [],
}

export const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        setPortfolioValues: (state, action: PayloadAction<PortfolioGet[] | null>) => {
            state.portfolioValues = action.payload;
        },
        deletePortfolioValue(state, action: PayloadAction<PortfolioGet>) {
            // suppress warning because it cannot be null if we have a button to click
            state.portfolioValues = state.portfolioValues!.filter(portfolio => portfolio.symbol !== action.payload.symbol);
        }
    }
})

export const { setPortfolioValues, deletePortfolioValue } = portfolioSlice.actions;
export default portfolioSlice.reducer;  // the store is gonne import this as portfolioReducer