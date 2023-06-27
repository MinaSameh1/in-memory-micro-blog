import express from "express";
import cors from "cors";
import { randomBytes } from "crypto";

interface Comment {
  id: string;
  content: string;
}

const commentsByPostId: { [key: string]: Comment[] } = {
  "b76d1a6a": [
    { id: "1", content: "This is a comment!" },
  ]
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
  res.status(201).send(commentsByPostId[req.params.id]);
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
