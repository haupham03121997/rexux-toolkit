import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import blogReducer from 'pages/Blog/blog.slice'
import { blogRTKApi } from 'pages/Blog/blogRTK.service'
import blogRTKReducer from 'pages/Blog/blogTRK.slice'
import { useDispatch, GetProps } from 'react-redux'
import { rtkQueryErrorLogger } from 'utils/middleware'

export const store = configureStore({
    reducer: {
        blog: blogReducer,
        blogRTK: blogRTKReducer,
        [blogRTKApi.reducerPath]: blogRTKApi.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(blogRTKApi.middleware, rtkQueryErrorLogger)
    }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
