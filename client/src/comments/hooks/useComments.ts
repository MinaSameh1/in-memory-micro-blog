import { useEffect, useRef, useState } from "react";

export default function useComments(postId: string) {
  const [update, setUpdate] = useState(false);
  const [comments, setComments] = useState<
    {
      id: string;
      content: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const abortController = useRef(new AbortController());

  useEffect(() => {
    const getComments = async () => {
      const { signal } = abortController.current;
      setLoading(true);
      const res = await fetch(
        `http://localhost:4001/posts/${postId}/comments`,
        {
          signal,
        }
      );
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error(data);
      }
      setComments(data);
      setLoading(false);
    };

    getComments();
    return () => {
      abortController.current.abort();
      abortController.current = new AbortController();
    };
  }, [postId, update]);

  const refresh = () => setUpdate((prev) => !prev);

  const cancel = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
  };

  return { comments, loading, refresh, cancel };
}
