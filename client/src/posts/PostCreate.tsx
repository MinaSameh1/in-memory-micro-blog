import usePostCreate from "./hooks/usePostCreate";

export default function PostsCreate() {
  const { title, loading, setInput, handleSubmit } = usePostCreate();

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
        disabled={loading}
        onClick={() => {
          handleSubmit();
        }}
      >
        {loading ? (
          <svg className="animate-spin h-6 w-8 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}
