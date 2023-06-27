import useComments from "./hooks/useComments";

interface Props {
  postId: string;
}

export default function CommentList({ postId }: Props) {
  const {
    comments,
    refresh,
    loading,
    cancel
  } = useComments(postId);

  return (
    <>
      <button onClick={refresh}>Refresh</button>
      {loading ? (
        <div>
          <button onClick={cancel}>Cancel</button>
          <span>Loading...</span>
        </div>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      )}
    </>
  )
}
