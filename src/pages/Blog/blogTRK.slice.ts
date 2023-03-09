import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface InitialState {
    postId: string
}
const initialState: InitialState = {
    postId: ''
}

const blogSlice = createSlice({
    name: ' blog',
    initialState,
    reducers: {
        startEditPost: (state, action: PayloadAction<string>) => {
            state.postId = action.payload
        },
        cancelEditPost: (state) => {
            state.postId = ''
        }
    }
})
const blogRTKReducer = blogSlice.reducer
export const { startEditPost, cancelEditPost } = blogSlice.actions
export default blogRTKReducer
