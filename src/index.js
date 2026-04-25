import 'dotenv/config';
import express from 'express';
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error-handler.js";

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

app.listen(3000, () => console.log('Server is running on port 3000'));