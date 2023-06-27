import { useState } from "react";

export default function usePostCreate() {
  const [title, setInput] = useState("");

  const addPost = async () => {
    try {
      const res = await fetch("http://localhost:4000/posts", {
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
      const items = addPost().then(() => {
        // Only on success
        setInput("");
      });
      return items;
    }
    return false;
  };
  return { addPost, handleSubmit, title, setInput };
}
