import { useState } from "react";

export default function useCommentCreate(postId: string) {
  const [content, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addComment = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_COMMENTS_URL}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );
      if (res.status !== 201) {
        return res.json().then((err) => {
          throw err;
        });
      }
      return await res.json();
    } catch (err) {
      return console.error(err);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    if (content.length > 0) {
      const items = addComment()
        .then(() => {
          // Only on success
          setInput("");
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
      return items;
    }
    setLoading(false);
    return false;
  };
  return { handleSubmit, content, setInput, loading };
}
