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
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Refresh
        </button>
        {loading ? (
          <div>
            <span>Loading...</span>
            <button onClick={cancel}>Cancel</button>
          </div>
        ) : (
          <div className="flex flex-row flex-wrap justify-between">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white p-6 w-1/4 shadow-lg rounded-lg m-4"
              >
                <div className="p-1">
                  <h3>{post.title}</h3>
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
