import useCommentCreate from "./hooks/useCommentCreate";

interface Props {
  postId: string;
}
export default function CommentCreate({ postId }: Props) {
  const { content, setInput, handleSubmit, loading } = useCommentCreate(postId);
  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="new-comment"
          className="mb-2 block font-bold text-gray-700"
        >
          New Comment
        </label>
        <input
          type="text"
          className="w-full rounded-lg border border-gray-400 px-4 py-2"
          id="new-comment"
          value={content}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={() => handleSubmit()}
        // on loading state, disable the button
        disabled={loading}
      >
        {
          // on loading state, show loading spinner
          loading ? (
            <svg className="mr-3 h-6 w-8 animate-spin" viewBox="0 0 24 24">
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
            "Comment"
          )
        }
      </button>
    </>
  );
}
