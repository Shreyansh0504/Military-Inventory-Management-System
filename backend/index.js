import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { conn } from './config/db.js';
import { userRouter } from './routes/userRoutes.js';
import { baseRouter } from './routes/baseRoutes.js';
import { assetRouter } from './routes/assetRoutes.js';
import { purchaseRouter } from './routes/purchaseRoutes.js';
import { assignmentRouter } from './routes/assignmentRoutes.js';
import { expenseRouter } from './routes/expenditureRoutes.js';
import { transferRouter } from './routes/transferRoutes.js';

const app = express();
app.use(express.json());
app.use(morgan("dev"));
dotenv.config();

// Database connection
conn();

// Enhanced CORS configuration
app.use(
  cors({
    origin: "https://shreyansh-military-ims.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicit OPTIONS handler
app.options('*', cors());

// Routes
app.use('/api/v1/user', userRouter);
app.use("/api/v1/base", baseRouter);
app.use("/api/v1/asset", assetRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/assign", assignmentRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/transfer", transferRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.bgGreen);
});
