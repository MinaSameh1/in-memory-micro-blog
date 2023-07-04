import usePostCreate from "./hooks/usePostCreate";

export default function PostsCreate() {
  const { title, setInput, handleSubmit } = usePostCreate();

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title
        </label>
        <input
          type="text"
          className="border border-gray-400 py-2 px-4 rounded-lg w-full"
          id="title"
          value={title}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit
      </button>
    </div>
  );
}
