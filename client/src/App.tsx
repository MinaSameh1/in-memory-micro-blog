import PostsCreate from "./posts/PostCreate";
import PostsList from "./posts/PostList";

function App() {
  return (
    <>
      <div className="container mx-auto mt-6 px-4">
        <h1>Create Post</h1>
        <PostsCreate />
        <hr className="my-6 w-full border-gray-300" />
        <h1>Posts</h1>
        <PostsList />
      </div>
    </>
  );
}

export default App;
