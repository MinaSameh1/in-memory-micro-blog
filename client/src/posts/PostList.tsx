import CommentCreate from "../comments/CommentCreate";
import CommentList from "../comments/CommentList";
import usePostsList from "./hooks/usePostsList";

export default function PostsList() {
  const { posts, refresh, loading, cancel } = usePostsList();
  return (
    <>
      <div className="container">
        <button onClick={refresh}>Refresh</button>
        {loading ? (
          <div>
            <span>Loading...</span>
            <button onClick={cancel}>Cancel</button>
          </div>
        ) : (
            <div className="d-flex flex-row flex-wraap justify-content-between">
              {
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="card"
                    style={{ width: "30%", marginBottom: "20px" }}
                  >
                    <div className="card-body">
                      <h3>{post.title}</h3>
                      <CommentList postId={post.id} />
                      <CommentCreate postId={post.id} />
                    </div>
                  </div>
                ))
              }
            </div>
        )}
      </div>
    </>
  );
}
