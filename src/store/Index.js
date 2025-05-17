// store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import categoryReducer from '../features/category/categorySlice'
import transactionReducer from '../features/transaction/transactionSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        category: categoryReducer,
        transaction: transactionReducer,
    },
})
