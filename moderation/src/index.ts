import axios, { AxiosError } from "axios";
import cors from "cors";
import express from "express";

const badWords = ["orange", "apple", "banana"];

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
  res.send("pong from moderation");
});

app.post(
  "/events",
  (
    req: express.Request<
      unknown,
      unknown,
      {
        type: "CommentCreated";
        data: {
          id: string;
          content: string;
          postId: string;
          status: "pending";
        };
      }
    >,
    res
  ) => {
    const event = req.body;
    if (!event?.type || !event?.data) {
      return res.status(400).send("Invalid event");
    }

    switch (event.type) {
      case "CommentCreated": {
        const { id, content, postId } = event.data;
        const status = badWords.some((word) => content.includes(word))
          ? "rejected"
          : "approved";
        setTimeout(async () => {
          console.log("CommentModerated", status)
          await axios.post("http://localhost:4005/events", {
            type: "CommentModerated",
            data: {
              id,
              postId,
              content,
              status,
            },
          });
        }, 5000);
      }
    }
   res.status(201).send([]);
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

app.listen(4003, () => {
  console.log("Listening on port 4003");
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
