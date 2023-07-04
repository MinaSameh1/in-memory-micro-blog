import { Comment } from "../types";

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  return (
    <>
      <ul>
        {comments.map((comment) => {
          if (comment.status === "approved")
            return (
              <li
                key={comment.id}
                className="mb-4 truncate rounded-lg border border-gray-400 px-4 py-2"
              >
                {comment.content}
              </li>
            );
          if (comment.status === "pending")
            return (
              <li
                key={comment.id}
                className="mb-4 rounded-lg border border-gray-400 px-4 py-2"
              >
                This comment is awaiting moderation
              </li>
            );
          if (comment.status === "rejected")
            return (
              <li
                key={comment.id}
                className="mb-4 rounded-lg border border-gray-400 px-4 py-2"
              >
                This comment has been rejected
              </li>
            );
        })}
      </ul>
    </>
  );
}
