import axios from "axios";
import cors from "cors";
import express from "express";

interface Posts {
  id: string;
  title: string;
  comments: Array<{
    id: string;
    content: string;
    status: "approved" | "pending" | "rejected";
  }>;
}

const Posts: Array<Posts> = [];

function handleEvent({
  type,
  data,
}:
  | {
      type: "PostCreated";
      data: {
        id: string;
        title: string;
      };
    }
  | {
      type: "CommentCreated";
      data: {
        id: string;
        content: string;
        postId: string;
        status: "approved" | "pending" | "rejected";
      };
    }
  | {
      type: "CommentUpdated";
      data: {
        id: string;
        postId: string;
        content: string;
        status: "approved" | "pending" | "rejected";
      };
    }) {
  switch (type) {
    case "PostCreated": {
      const { id, title } = data;
      Posts.push({
        id,
        title,
        comments: [],
      });
      return "Post created";
    }
    case "CommentCreated": {
      const { id, content, postId, status } = data;
      const post = Posts.find((post) => post.id === postId);
      if (!post) {
        throw new Error("Post not found");
      }
      post.comments.push({ id, content, status });
      return "Comment created";
    }
    case "CommentUpdated": {
      const { id, postId, content, status } = data;
      const post = Posts.find((post) => post.id === postId);
      if (!post) {
        throw new Error("Post not found");
      }
      const comment = post.comments.find((comment) => comment.id === id);
      if (!comment) {
        throw new Error("Comment not found");
      }
      comment.status = status;
      comment.content = content;
      return "Comment updated";
    }
    default:
      return "Event not handled";
  }
}
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use((req, res, next) => {
  res.on("finish", () => {
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      contentLength: res.get("Content-Length"),
    });
  });
  next();
});

app.get("/posts", (_, res) => {
  res.send(Posts);
});

app.post("/events", (req, res) => {
  const event = req.body;
  if (!event?.type || !event?.data) {
    return res.status(400).json({ message: "Invalid event" });
  }
  handleEvent(event);
  res.send({ message: "Event received" });
});

app.get("/ping", (_, res) => {
  res.send("pong from posts");
});
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error(err);
    return res.status(500).send("Something broke!");
  }
);

app.listen(4002, async () => {
  console.log("Listening on port 4002");
  const res = await axios.get("http://localhost:4005/events");
  for (const event of res.data) {
    handleEvent(event);
  }
});

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
});

process.on("SIGINT", () => {
  process.exit(0);
});
