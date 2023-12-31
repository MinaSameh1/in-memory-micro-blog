import axios, { AxiosError } from "axios";
import cors from "cors";
import express from "express";

interface Event {
  type: string;
  data: unknown;
}

const events: Event[] = [
  {
    type: "PostCreated",
    data: {
      id: "b76d1a6a",
      title: "test",
    },
  },
  {
    type: "CommentCreated",
    data: {
      id: "a6fbc9f2",
      content: "This is a comment!",
      postId: "b76d1a6a",
      status: "approved",
    },
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
  res.send("pong from events");
});

app.get("/events", (req, res) => {
  if (req.query?.type) {
    return res.send(events.filter((e) => e.type === req.query.type));
  }
  res.send(events);
});

app.post("/events", async (req, res, next) => {
  const event = req.body;
  if (!event?.type || !event?.data) {
    return res.status(400).json({ message: "Invalid event" });
  }
  events.push(event);

  console.log(event.type);
  const cancelToken = axios.CancelToken;
  // abort early if event is not valid
  try {
    console.count("events");
    await axios.post("http://localhost:4000/events", event, {
      cancelToken: cancelToken.source().token,
    });
    console.count("events");
    await axios.post("http://localhost:4001/events", event, {
      cancelToken: cancelToken.source().token,
    });
    console.count("events");
    await axios.post("http://localhost:4002/events", event, {
      cancelToken: cancelToken.source().token,
    });
    console.count("events");
    await axios.post("http://localhost:4003/events", event, {
      cancelToken: cancelToken.source().token,
    });

    return res.send({ status: "OK" });
  } catch (err) {
    cancelToken.source().cancel();
    return next(err);
  }
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    if (err instanceof AxiosError)
      console.error(err.response?.data || err.response?.statusText);
    else console.error(err);
    return res.status(500).send("Something broke!");
  }
);

app.listen(4005, () => {
  console.log("Listening on port 4005");
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
