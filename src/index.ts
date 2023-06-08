import express from "express";
import inventoryRouter from "./routes/inventory";
import bookRouter from "./routes/book";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json";

import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT ?? 3000;

app.use("/inventory", inventoryRouter);
app.use("/book", bookRouter);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
