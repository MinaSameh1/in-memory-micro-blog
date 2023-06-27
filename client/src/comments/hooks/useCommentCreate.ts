import { useState } from "react";

export default function useCommentCreate(postId: string) {
  const [content, setInput] = useState("");

  const addComment = async () => {
    try {
      const res = await fetch(
        `http://localhost:4001/posts/${postId}/comments`,
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
    if (content.length > 0) {
      const items = addComment().then(() => {
        // Only on success
        setInput("");
      });
      return items;
    }
    return false;
  };
  return { handleSubmit, content, setInput };
}
