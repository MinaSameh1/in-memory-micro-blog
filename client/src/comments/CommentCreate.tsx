import useCommentCreate from "./hooks/useCommentCreate";

interface Props {
  postId: string;
}
export default function CommentCreate({ postId }: Props) {
  const { content, setInput, handleSubmit } = useCommentCreate(postId);
  return (
    <>
      <div className="form-group">
        <label htmlFor="new-comment">New Comment</label>
        <input
          type="text"
          className="form-control"
          id="new-comment"
          value={content}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={() => handleSubmit()}>
        Comment
      </button>
    </>
  );
}
