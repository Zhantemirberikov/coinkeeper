import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Получить категории текущего пользователя
export const fetchCategories = createAsyncThunk(
    'category/fetchAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id
            const { data } = await api.get('/categories', {
                params: { userId }
            })
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// ✅ Добавить категорию с защитой от redirect
export const addCategory = createAsyncThunk(
    'category/add',
    async (title, { getState, rejectWithValue }) => {
        try {
            const userId = getState().auth.user?.id
            const response = await api.post('/categories', { title, userId }, {
                validateStatus: () => true,
                maxRedirects: 0
            })
            return response.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const removeCategory = createAsyncThunk(
    'category/remove',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/categories/${id}`)
            return id
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.items.push(action.payload)
            })
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.items = state.items.filter(cat => cat.id !== action.payload)
            })
    },
})

export default categorySlice.reducer
