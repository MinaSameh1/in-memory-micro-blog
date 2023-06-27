import axios from "axios";
import cors from "cors";
import { randomBytes } from "crypto";
import express from "express";

interface Post {
  id: string;
  title: string;
}

// In memory database
const posts: Post[] = [
  {
    id: "b76d1a6a",
    title: "test",
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

app.get("/ping", (_, res) => {
  res.send("pong from posts");
});

app.get("/posts", (_, res) => {
  res.send(posts);
});

app.get("/posts/:id", (req, res) => {
  if (!req.params.id) {
    return res.status(400).send("Id is required");
  }
  const post = posts.find((post) => post.id === req.params.id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.send(post);
});

app.post("/posts", (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).send("Title is required");
  }
  const id = randomBytes(4).toString("hex");
  const post = { id, title };
  posts.push(post);
  axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: post,
  });
  res.status(201).send(post);
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

app.listen(4000, () => {
  console.log("Listening on port 4000");
});
