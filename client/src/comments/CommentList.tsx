import { Comment } from "../types";

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  return (
    <>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </>
  );
}
