import useCommentCreate from "./hooks/useCommentCreate";

interface Props {
  postId: string;
}
export default function CommentCreate({ postId }: Props) {
  const { content, setInput, handleSubmit } = useCommentCreate(postId);
  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="new-comment"
          className="block text-gray-700 font-bold mb-2"
        >
          New Comment
        </label>
        <input
          type="text"
          className="border border-gray-400 py-2 px-4 rounded-lg w-full"
          id="new-comment"
          value={content}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleSubmit()}>
        Comment
      </button>
    </>
  );
}
