import { useState } from "react";

export default function usePostCreate() {
  const [title, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addPost = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_POSTS_URL + "/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      return await res.json();
    } catch (err) {
      return console.log(err);
    }
  };

  const handleSubmit = () => {
    if (title.length > 0) {
      setLoading(true);
      const items = addPost()
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
  return { addPost, loading, handleSubmit, title, setInput };
}
