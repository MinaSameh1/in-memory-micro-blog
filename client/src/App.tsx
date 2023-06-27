import PostsCreate from "./posts/PostCreate";
import PostsList from "./posts/PostList";

function App() {
  return (
    <>
      <div className="container">
        <h1>Create Post</h1>
        <PostsCreate />
        <br />
        <h1>Posts</h1>
        <PostsList />
      </div>
    </>
  );
}

export default App;