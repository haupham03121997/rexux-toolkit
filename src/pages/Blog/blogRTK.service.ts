import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post } from 'type/blog.type'

export const blogRTKApi = createApi({
    reducerPath: 'blogRTKApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
    tagTypes: ['Posts'],
    endpoints: (builder) => ({
        getPostList: builder.query<Post[], void>({
            query: () => 'post',
            providesTags: (result) => {
                return result
                    ? // successful query
                      [...result.map(({ id }) => ({ type: 'Posts', id } as const)), { type: 'Posts', id: 'LIST' }]
                    : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
                      [{ type: 'Posts', id: 'LIST' }]
            }
        }),
        addPost: builder.mutation<Post, Omit<Post, 'id'>>({
            query: (body) => ({
                url: 'post',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'Posts', id: 'LIST' }]
        }),
        getPostById: builder.query<Post, string>({
            query: (id) => `post/${id}`
        }),
        updatePost: builder.mutation<Post, { id: string; body: Post }>({
            query: ({ id, body }) => {
                return {
                    url: `post/${id}`,
                    method: 'PUT',
                    body
                }
            }
        }),
        deletePost: builder.mutation<{}, string>({
            query: (id) => ({
                url: `post/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_, __, id) => [{ type: 'Posts' as const, id }]
        })
    })
})

export const {
    useGetPostListQuery,
    useAddPostMutation,
    useGetPostByIdQuery,
    useUpdatePostMutation,
    useDeletePostMutation
} = blogRTKApi
