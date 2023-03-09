import { useDeletePostMutation, useGetPostListQuery } from 'pages/Blog/blogRTK.service'
import { startEditPost } from 'pages/Blog/blogTRK.slice'
import { useAppDispatch } from 'redux/store'
import PostItem from '../PostItem'
import SkeletonPost from '../SkeletonPost'

export default function PostList() {
    const dispatch = useAppDispatch()

    const { data, isFetching } = useGetPostListQuery()
    const [deletePostMutate, { isLoading: isDeleting }] = useDeletePostMutation()

    const handleDelete = async (id: string) => {
        await deletePostMutate(id).unwrap()
    }
    const handleStartEditing = (id: string) => {
        dispatch(startEditPost(id))
    }

    return (
        <div className='bg-white py-6 sm:py-8 lg:py-12'>
            <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
                <div className='mb-10 md:mb-16'>
                    <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>Blog</h2>
                    <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
                        Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ. Nhưng ngày mốt sẽ có nắng
                    </p>
                </div>
                <div className='grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
                    {isFetching && (
                        <>
                            <SkeletonPost />
                            <SkeletonPost />
                        </>
                    )}
                    {!isFetching &&
                        data?.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                handleDelete={handleDelete}
                                onStartEdit={handleStartEditing}
                                isDeleting={isDeleting}
                            />
                        ))}
                </div>
            </div>
        </div>
    )
}
