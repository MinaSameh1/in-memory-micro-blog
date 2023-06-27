import { useEffect, useRef, useState } from "react";
import { Comment } from "../../types";

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

export default function usePostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const controller = useRef(new AbortController());

  useEffect(() => {
    const { signal } = controller.current;
    const fetchPosts = () => {
      setLoading(true);
      fetch("http://localhost:4002/posts", {
        signal,
      })
        .then((res) => {
          if (res.status !== 200) {
            return res.json().then((err) => {
              throw err;
            });
          }
          return res.json();
        })
        .then((res) => {
          setLoading(false);
          return setPosts(res);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchPosts();
    // return () => {
    //   controller.current.abort();
    // };
  }, [update, controller]);

  const refresh = () => setUpdate((prev) => !prev);
  const cancel = () => controller.current.abort();
  return { posts, refresh, loading, cancel };
}
