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

const Posts: Array<Posts> = [
  {
    id: "b76d1a6a",
    title: "test",
    comments: [
      { id: "a6fbc9f2", content: "This is a comment!", status: "approved" },
    ],
  },
];

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

app.post(
  "/events",
  (
    req: express.Request<
      unknown,
      unknown,
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
        }
    >,
    res
  ) => {
    const event = req.body;
    if (!event?.type || !event?.data) {
      return res.status(400).json({ message: "Invalid event" });
    }

    switch (event.type) {
      case "PostCreated": {
        const { id, title } = event.data;
        Posts.push({
          id,
          title,
          comments: [],
        });
        return res.status(201).json({ message: "Post created" });
      }
      case "CommentCreated": {
        const { id, content, postId } = event.data;
        const post = Posts.find((post) => post.id === postId);
        if (!post) {
          return res.status(400).json({ message: "Post not found" });
        }
        post.comments.push({ id, content, status: "pending" });
        return res.status(201).json({ message: "Comment created" });
      }
      case "CommentUpdated": {
        const { id, postId, content, status } = event.data;
        const post = Posts.find((post) => post.id === postId);
        if (!post) {
          return res.status(400).json({ message: "Post not found" });
        }
        const comment = post.comments.find((comment) => comment.id === id);
        if (!comment) {
          return res.status(400).json({ message: "Comment not found" });
        }
        comment.status = status;
        comment.content = content;
        return res.status(201).json({ message: "Comment moderated" });
      }
      default:
        return res.status(200).json({ message: "Event not handled" });
    }
  }
);

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

app.listen(4002, () => {
  console.log("Listening on port 4002");
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
