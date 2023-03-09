import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post } from 'type/blog.type'
import http from 'utils/http'

interface BlogState {
    posts: Post[]
    editingPost: Post | null
    isLoading: boolean
}
const initialState: BlogState = {
    posts: [],
    editingPost: null,
    isLoading: false
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export const fetchPostsList = createAsyncThunk('blog/getPostListSuccess', async (_, thunkApi) => {
    // const controller = new AbortController()
    const response = await http.get<Post[]>('post', {
        signal: thunkApi.signal
    })
    return response.data
})

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkApi) => {
    const response = await http.post<Post>('post', body, {
        signal: thunkApi.signal
    })
    return response.data
})

export const updatePost = createAsyncThunk('blog/updatePost', async (body: Post, thunkApi) => {
    const response = await http.put<Post>(`post/${body.id}`, body, {
        signal: thunkApi.signal
    })
    return response.data
})

export const deletePost = createAsyncThunk('blog/deletePost', async (id: string, thunkApi) => {
    const response = await http.delete(`post/${id}`, {
        signal: thunkApi.signal
    })
    return response.data
})
// export const addPost = createAction<Post>('blog/addPost')
// export const deletePost = createAction<string>('blog/deletePost')
// export const startEditingPost = createAction<string>('blog/startEditingPost')
// export const cancelEditingPost = createAction('blog/cancelEditingPost')
// export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

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
const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        // addPost: {
        //     reducer: (state, action: PayloadAction<Post>) => {
        //         //immerjs
        //         //immerjs giup ta khong can phai tao ra 1 object moi
        //         const post = action.payload
        //         state.posts.push(post)
        //     },
        //     prepare: (post: Omit<Post, 'id'>) => ({
        //         payload: {
        //             ...post,
        //             id: nanoid()
        //         }
        //     })
        // },
        // deletePost: (state, action: PayloadAction<String>) => {
        //     const id = action.payload
        //     state.posts = state.posts.filter((post) => post.id !== id)
        // },
        startEditingPost: (state, action: PayloadAction<String | null>) => {
            const foundPost = state.posts.find((post) => post.id === action.payload) || null
            state.editingPost = foundPost
        },
        cancelEditingPost: (state) => {
            state.editingPost = null
        },
        finishEditingPost: (state, action: PayloadAction<Post>) => {
            const post = action.payload
            const foundPostIndex = state.posts.findIndex((p) => p.id === post.id)
            if (foundPostIndex !== -1) {
                state.posts[foundPostIndex] = post
                state.editingPost = null
            }
            state.editingPost = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPostsList.fulfilled, (state, action) => {
                state.posts = action.payload
            })
            .addCase(addPost.fulfilled, (state, action) => {
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.posts.find((post, index) => {
                    if (post.id === action.payload.id) {
                        state.posts[index] = action.payload
                        return true
                    }
                    return false
                })
                state.editingPost = null
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                const postId = action.meta.arg
                const deletePostIndex = state.posts.findIndex((post) => post.id === postId)
                if (deletePostIndex !== -1) {
                    state.posts.splice(deletePostIndex, 1)
                }
            })
            .addMatcher<PendingAction>(
                (action) => action.type.endsWith('/pending'),
                (state, action) => {
                    state.isLoading = true
                }
            )
            .addMatcher<FulfilledAction | RejectedAction>(
                (action) => action.type.endsWith('/fulfilled' || '/rejected'),
                (state, action) => {
                    state.isLoading = false
                }
            )
            .addDefaultCase((state, action) => {
                console.log(action.type)
            })
    }
})
// const blogReducer = createReducer(initialState, {
//     [addPost.type]: (state, action: PayloadAction<Post>) => {
//         //immerjs
//         //immerjs giup ta khong can phai tao ra 1 object moi
//         const post = action.payload
//         state.posts.push(post)
//     },

//     [deletePost.type]: (state, action: PayloadAction<String>) => {
//         const id = action.payload
//         state.posts = state.posts.filter((post) => post.id !== id)
//     },
//     [startEditingPost.type]: (state, action: PayloadAction<String | null>) => {
//         const foundPost = state.posts.find((post) => post.id === action.payload) || null
//         state.editingPost = foundPost
//     },
//     [cancelEditingPost.type]: (state, _) => {
//         state.editingPost = null
//     },
//     [finishEditingPost.type]: (state, action: PayloadAction<Post>) => {
//         const post = action.payload
//         const foundPostIndex = state.posts.findIndex((p) => p.id === post.id)
//         if (foundPostIndex !== -1) {
//             state.posts[foundPostIndex] = post
//             state.editingPost = null
//         }
//         state.editingPost = null
//     }
// })
export const { startEditingPost, finishEditingPost, cancelEditingPost } = blogSlice.actions
export default blogSlice.reducer
