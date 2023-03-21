import classNames from 'classnames'
import { cancelEditingPost } from 'pages/Blog/blog.slice'
import { useAddPostMutation, useGetPostByIdQuery, useUpdatePostMutation } from 'pages/Blog/blogRTK.service'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'redux/store'
import { Post } from 'type/blog.type'
import { isEntityError } from 'utils/helpers'

const initialState: Omit<Post, 'id'> = {
    title: '',
    featuredImage: '',
    description: '',
    publishDate: '',
    published: false
}

type ErrorForm =
    | {
          [key in keyof typeof initialState]: string
      }
    | null
// [key in keyof Omit<Post, 'id'>]: string, // Cách để lấy tất cả các key của Post

export default function CreatePost() {
    const dispatch = useDispatch<AppDispatch>()
    const [formData, setFormData] = useState<Omit<Post, 'id'>>(initialState)
    const postId = useSelector((state: RootState) => state.blogRTK.postId)

    const [addPostMutate, addPostResult] = useAddPostMutation()
    const [updatePostMutate, updatePostResult] = useUpdatePostMutation()
    const { data: post } = useGetPostByIdQuery(postId, { skip: !postId })

    const errorForm: ErrorForm = useMemo(() => {
        const errorResult = postId ? updatePostResult.error : addPostResult.error
        if (isEntityError(errorResult)) {
            return errorResult.data.error as ErrorForm
        }
        return null
    }, [updatePostResult, addPostResult, postId])

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (postId) {
            await updatePostMutate({ id: postId, body: formData as Post }).unwrap()
        } else {
            addPostMutate(formData).then((res) => {
                console.log('res', res)
            })
        }
        setFormData(initialState)
    }

    const handleCancel = () => {
        dispatch(cancelEditingPost())
    }

    useEffect(() => {
        if (post) setFormData(post)
    }, [post])

    return (
        <form onSubmit={handleSubmit} onReset={handleCancel}>
            <div className='mb-6'>
                <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
                    Title
                </label>
                <input
                    type='text'
                    id='title'
                    name='title'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    placeholder='Title'
                    value={formData.title}
                    onChange={onChange}
                    required
                />
            </div>
            <div className='mb-6'>
                <label
                    htmlFor='featuredImage'
                    className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                    Featured Image
                </label>
                <input
                    type='text'
                    id='featuredImage'
                    name='featuredImage'
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                    placeholder='Url image'
                    value={formData.featuredImage}
                    onChange={onChange}
                    required
                />
            </div>
            <div className='mb-6'>
                <div>
                    <label
                        htmlFor='description'
                        className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'
                    >
                        Description
                    </label>
                    <textarea
                        id='description'
                        rows={3}
                        name='description'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
                        placeholder='Your description...'
                        value={formData.description}
                        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setFormData((prev) => ({ ...prev, description: event.target.value }))
                        }}
                        required
                    />
                </div>
            </div>
            <div className='mb-6'>
                <label
                    htmlFor='publishDate'
                    className={classNames('mb-2 block text-sm font-medium ', {
                        'text-red-700': Boolean(errorForm?.publishDate),
                        'dark:text-gray-400': !Boolean(errorForm?.publishDate)
                    })}
                >
                    Publish Date
                </label>
                <input
                    type='datetime-local'
                    id='publishDate'
                    className={classNames('block w-56 rounded-lg border  p-2.5 text-sm  focus:outline-none', {
                        'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500': Boolean(
                            errorForm?.publishDate
                        ),
                        'border-gray-300 bg-gray-50  text-gray-900 focus:border-blue-500  focus:ring-blue-500':
                            !Boolean(errorForm?.publishDate)
                    })}
                    placeholder='Title'
                    value={formData.publishDate}
                    name='publishDate'
                    onChange={onChange}
                    required
                />
                {errorForm?.publishDate && (
                    <p className='mt-2 text-sm text-red-500'>
                        <span className='font-medium'>Error! </span>
                        {errorForm.publishDate}
                    </p>
                )}
            </div>
            <div className='mb-6 flex items-center'>
                <input
                    checked={formData.published}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => ({ ...prev, published: event.target.checked }))
                    }
                    id='publish'
                    type='checkbox'
                    className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
                />
                <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
                    Publish
                </label>
            </div>

            {postId && (
                <Fragment>
                    <button
                        type='submit'
                        className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
                    >
                        <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                            Update Post
                        </span>
                    </button>
                    <button
                        type='reset'
                        className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
                    >
                        <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                            Cancel
                        </span>
                    </button>
                </Fragment>
            )}

            {!postId && (
                <button
                    className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
                    type='submit'
                >
                    <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                        Publish Post
                    </span>
                </button>
            )}
        </form>
    )
}
