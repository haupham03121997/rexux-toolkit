import { createAction, createReducer, PayloadAction } from '@reduxjs/toolkit'
import { initialPostList } from 'pages/constants/blog'
import { Post } from 'type/blog.type'

interface BlogState {
    posts: Post[]
    editingPost: Post | null
}
const initialState: BlogState = {
    posts: initialPostList,
    editingPost: null
}
export const addPost = createAction<Post>('blog/addPost')
export const deletePost = createAction<string>('blog/deletePost')
export const startEditingPost = createAction<string>('blog/startEditingPost')
export const cancelEditingPost = createAction('blog/cancelEditingPost')
export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

// const blogReducer = createReducer(initialState, (builder) => {
//     builder
//         .addCase(addPost, (state, action) => {
//             //immerjs
//             //immerjs giup ta khong can phai tao ra 1 object moi
//             const post = action.payload
//             state.posts.push(post)
//         })
//         .addCase(deletePost, (state, action) => {
//             const id = action.payload
//             state.posts = state.posts.filter((post) => post.id !== id)
//         })
//         .addCase(startEditingPost, (state, action) => {
//             const foundPost = state.posts.find((post) => post.id === action.payload) || null
//             state.editingPost = foundPost
//         })
//         .addCase(cancelEditingPost, (state, _) => {
//             state.editingPost = null
//         })
//         .addCase(finishEditingPost, (state, action) => {
//             const post = action.payload
//             const foundPostIndex = state.posts.findIndex((p) => p.id === post.id)
//             if (foundPostIndex !== -1) {
//                 state.posts[foundPostIndex] = post
//                 state.editingPost = null
//             }
//             state.editingPost = null
//         })
//         .addMatcher(
//             (action) => action.type.includes('cancel'),
//             (state, action) => {
//                 console.log(action.type)
//             }
//         )
// })
const blogReducer = createReducer(initialState, {
    [addPost.type]: (state, action: PayloadAction<Post>) => {
        //immerjs
        //immerjs giup ta khong can phai tao ra 1 object moi
        const post = action.payload
        state.posts.push(post)
    },

    [deletePost.type]: (state, action: PayloadAction<String>) => {
        const id = action.payload
        state.posts = state.posts.filter((post) => post.id !== id)
    },
    [startEditingPost.type]: (state, action: PayloadAction<String | null>) => {
        const foundPost = state.posts.find((post) => post.id === action.payload) || null
        state.editingPost = foundPost
    },
    [cancelEditingPost.type]: (state, _) => {
        state.editingPost = null
    },
    [finishEditingPost.type]: (state, action: PayloadAction<Post>) => {
        const post = action.payload
        const foundPostIndex = state.posts.findIndex((p) => p.id === post.id)
        if (foundPostIndex !== -1) {
            state.posts[foundPostIndex] = post
            state.editingPost = null
        }
        state.editingPost = null
    }
})
export default blogReducer
