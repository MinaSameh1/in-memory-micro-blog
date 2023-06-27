import axios from "axios";
import cors from "cors";
import { randomBytes } from "crypto";
import express from "express";

interface Comment {
  id: string;
  content: string;
}

const commentsByPostId: { [key: string]: Comment[] } = {
  b76d1a6a: [{ id: "a6fbc9f2", content: "This is a comment!" }],
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
  const commentId = randomBytes(4).toString("hex");
  const comments = commentsByPostId[req.params.id] || [];
  commentsByPostId[req.params.id] = [...comments, { id: commentId, content }];

  axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(commentsByPostId[req.params.id]);
});

app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);
  return res.status(201).send([]);
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.log(err);
    return res.status(500).send("Something broke!");
  }
);

app.listen(4001, () => {
  console.log("Listening on port 4001");
});
