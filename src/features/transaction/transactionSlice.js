import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Получить транзакции текущего пользователя
export const fetchTransactions = createAsyncThunk(
    'transaction/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id
            const { data } = await api.get('/transactions', {
                params: { userId }
            })
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Добавить транзакцию
export const addTransaction = createAsyncThunk(
    'transaction/add',
    async (tx, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id
            const { data } = await api.post('/transactions', { ...tx, userId })
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Удалить транзакцию
export const deleteTransaction = createAsyncThunk(
    'transaction/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/transactions/${id}`)
            return id
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Обновить транзакцию (обязательно сохраняем userId!)
export const updateTransaction = createAsyncThunk(
    'transaction/update',
    async ({ id, ...rest }, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id
            const { data } = await api.put(`/transactions/${id}`, { ...rest, userId })
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.items.unshift(action.payload)
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.items = state.items.filter(tx => tx.id !== action.payload)
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.items = state.items.map(tx =>
                    tx.id === action.payload.id ? action.payload : tx
                )
            })
    },
})

export default transactionSlice.reducer
