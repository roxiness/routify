import express from "express";
import { createServer as createViteServer } from "vite";
import { routifyViteSsr, routifyProdSsr } from "@roxi/routify/lib/extra/express-plugin/index.js";

async function createServer() {
  const app = express();

  // example endpoint
  app.get("/api", (req, res) => {
    res.json({ hello: "world" });
  });

  if (process.env.NODE_ENV === "development") {
    app.use(await routifyViteSsr(createViteServer));
  } else {
    app.use(express.static("dist/client"));
    app.use(await routifyProdSsr('dist/server/serve.js'));
  }

  app.listen(3000);
  console.log("listening on http://localhost:3000");
}

createServer();
