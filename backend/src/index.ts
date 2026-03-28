import "dotenv/config";
import cors from "cors";
import express from "express";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/orders.routes";
import productRoutes, {
  randomProductsHandler,
  shuffledProductsHandler,
} from "./routes/products.routes";

const app = express();

// Allow any dev origin (Vite port/host) so /cart/preview POST is not blocked by CORS.
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// Register before `app.use("/products", …)` so Express 5 does not treat `random` / `shuffled`
// as `/:id` inside the mounted router (which caused 404s).
app.get("/products/random", randomProductsHandler);
app.get("/products/shuffled", shuffledProductsHandler);

app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

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
