import CommentCreate from "../comments/CommentCreate";
import CommentList from "../comments/CommentList";
import usePostsList from "./hooks/usePostsList";

export default function PostsList() {
  const { posts, refresh, loading, cancel } = usePostsList();
  return (
    <>
      <div className="container">
        <button
          onClick={refresh}
          className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
        >
          Refresh
        </button>
        {loading ? (
          <div>
            <button
              onClick={cancel}
              className="mt-6 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600"
            >
              Cancel
            </button>
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-between">
            {posts.map((post) => (
              <div
                key={post.id}
                className="m-4 w-1/4 rounded-lg bg-white p-6 shadow-lg"
              >
                <div className="p-1">
                  <div className="truncate whitespace-nowrap text-2xl font-bold text-gray-700">
                    {post.title}
                  </div>
                  <CommentList comments={post.comments} />
                  <hr className="m-4" />
                  <CommentCreate postId={post.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
