import "dotenv/config";
import cors from "cors";
import express from "express";
import productRoutes from "./routes/products.routes";

const app = express();

const corsOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

app.use(
  cors({
    origin: corsOrigins,
  }),
);
app.use(express.json());

app.use("/products", productRoutes);

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
