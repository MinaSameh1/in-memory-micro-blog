import PostsCreate from "./posts/PostCreate";
import PostsList from "./posts/PostList";

function App() {
  return (
    <>
      <div className="container mx-auto px-4 mt-6">
        <h1>Create Post</h1>
        <PostsCreate />
        <hr className="my-6 border-gray-300 w-full" />
        <h1>Posts</h1>
        <PostsList />
      </div>
    </>
  );
}

export default App;
