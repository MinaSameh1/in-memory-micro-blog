import axios from "axios";
import cors from "cors";
import { randomBytes } from "crypto";
import express from "express";

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

app.post("/events", (req, res, next) => {
  const event = req.body;
  if (!event?.type || !event?.data) {
    return res.status(400).json({ message: "Invalid event" });
  }

  const cancelToken = axios.CancelToken;
  // abort early if event is not valid
  try {
    axios.post("http://localhost:4000/events", event, {
      cancelToken: cancelToken.source().token,
    });
    axios.post("http://localhost:4001/events", event, {
      cancelToken: cancelToken.source().token,
    });
    axios.post("http://localhost:4002/events", event, {
      cancelToken: cancelToken.source().token,
    });
  } catch (err) {
    console.error(err);
    cancelToken.source().cancel();
    next(err);
  }

  res.send({ status: "OK" });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.log(err);
    return res.status(500).send("Something broke!");
  }
);

app.listen(4005, () => {
  console.log("Listening on port 4005");
});
