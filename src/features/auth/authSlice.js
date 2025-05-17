import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Регистрация нового пользователя
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/users', { email, password })
            return { user: data, token: 'fake-jwt-token' }
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Вход пользователя
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/users', {
                params: { email, password }
            })
            if (!data.length) {
                return rejectWithValue('Неверный email или пароль')
            }
            return { user: data[0], token: 'fake-jwt-token' }
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Загрузка состояния из localStorage при старте
const storedUser = localStorage.getItem('user')
const storedToken = localStorage.getItem('token')

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        status: 'idle',
        error: null
    },
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.status = 'idle'
            state.error = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.user = action.payload.user
                state.token = action.payload.token
                localStorage.setItem('user', JSON.stringify(action.payload.user))
                localStorage.setItem('token', action.payload.token)
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
    }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
