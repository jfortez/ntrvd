import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { appRouter } from "./router";
import cors from "cors";

const app = express();
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    middleware: cors(),
    createContext: () => {
      console.log("Context created");
      return {};
    },
  })
);
const PORT = process.env.PORT || 3000;

console.log(`Server is running on http://localhost:${PORT}/trpc`);
app.listen(PORT);
