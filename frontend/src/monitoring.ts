import pino from "pino";

export const log = pino({
  transport: {
    targets: [
      {
        target: "pino/file",
        options: { destination: 1 }, // log to stdout
        level: "debug",
      },
      {
        target: "pino-loki",
        options: {
          host: `${process.env.LOKI_ENDPOINT ?? "http://localhost:3100"}`,
          batching: true,
          interval: 2,
          labels: { app: "cozi-stay-frontend" },
        },
        level: "info",
      },
    ],
  },
});
