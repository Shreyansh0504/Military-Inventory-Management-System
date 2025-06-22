import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { conn } from './config/db.js';
import { userRouter } from './routes/userRoutes.js';
import { baseRouter } from './routes/baseRoutes.js';
import { assetRouter } from './routes/assetRoutes.js';
import { purchaseRouter } from './routes/purchaseRoutes.js';
import { assignmentRouter } from './routes/assignmentRoutes.js';
import { expenseRouter } from './routes/expenditureRoutes.js';
import { transferRouter } from './routes/transferRoutes.js';
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

// Database connection
conn();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


import cors from 'cors';

// Enhanced CORS configuration
app.use(
  cors({
    origin: "https://shreyansh-military-ims.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
    
  })
);


    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,

app.use(express.json())
app.use(morgan('dev'))

// Explicit OPTIONS handler
// app.options('*', cors());

// Routes
app.use('/api/v1/user', userRouter);
app.use("/api/v1/base", baseRouter);
app.use("/api/v1/asset", assetRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/assign", assignmentRouter);
app.use("/api/v1/expense", expenseRouter);
app.use("/api/v1/transfer", transferRouter);

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Server error');
// });

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`.bgGreen);
});
