import axios, { AxiosError } from "axios";
import cors from "cors";
import { randomBytes } from "crypto";
import express from "express";

interface Comment {
  id: string;
  content: string;
  status: "approved" | "pending" | "rejected";
}

const commentsByPostId: { [key: string]: Comment[] } = {
  b76d1a6a: [
    { id: "a6fbc9f2", content: "This is a comment!", status: "approved" },
  ],
};

const app = express();
app.use(cors());
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

app.get("/ping", (_, res) => {
  res.send("pong from Comments");
});

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).send("Content is required");
  }
  const comment = {
    id: randomBytes(4).toString("hex"),
    content,
    status: "pending" as const,
  };

  const comments = commentsByPostId[req.params.id] || [];
  commentsByPostId[req.params.id] = [...comments, comment];

  axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      ...comment,
      postId: req.params.id,
    },
  });

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.post(
  "/events",
  async (
    req: express.Request<
      unknown,
      unknown,
      {
        type: "CommentModerated";
        data: {
          id: string;
          postId: string;
          status: "approved" | "pending" | "rejected";
        };
      }
    >,
    res
  ) => {
    const { type, data } = req.body;
    const fireUpdatedEvent = (comment: Comment & { postId: string }) => {
      return axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: comment,
      });
    };

    switch (type) {
      case "CommentModerated": {
        const { id, postId, status } = data;
        const comments = commentsByPostId[postId];
        if (!comments) {
          return res.status(404).send("Not found");
        }
        const comment = comments.find((comment) => comment.id === id);
        if (!comment) {
          return res.status(404).send("Not found");
        }
        comment.status = status;
        await fireUpdatedEvent({
          ...comment,
          postId,
        });
        return res.status(201).send([]);
      }
      default: {
        return res.status(200).send([]);
      }
    }
  }
);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof AxiosError)
      console.error(err.response?.data || err.response?.statusText);
    else console.error(err);
    return res.status(500).send("Something broke!");
  }
);

app.listen(4001, () => {
  console.log("Listening on port 4001");
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
