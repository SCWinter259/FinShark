import {configureStore} from "@reduxjs/toolkit";
import portfolioReducer from './Slices/portfolioSlice'

const store =  configureStore({
    reducer: {
        portfolio: portfolioReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export default store;