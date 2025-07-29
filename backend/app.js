import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserRouter from './routes/user.route.js';
import CardRouter from "./routes/card.route.js";
import AdminRouter from "./routes/admin.route.js";
import templateRoutes from './routes/template.route.js';
import cors from "cors";
import path from "path";
import ProfileRouter from './routes/profile.route.js'
import { fileURLToPath } from "url";
import db from "./Configdb/dbConfig.js"

dotenv.config();

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect DB
  db().then(() => {
    console.log("MongoDB connected");

    // Middleware
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Static Folder Serving (VERY IMPORTANT)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/profile-pics', express.static(path.join(__dirname, 'middleware/profile-pics')));

    // Routes
    app.use("/user", UserRouter);
    app.use("/profile", ProfileRouter);
    app.use("/card", CardRouter);
    app.use("/admin", AdminRouter);
    app.use("/templates", templateRoutes);

    // Start Server
    app.listen(process.env.PORT ,() => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

  }).catch((err) => {
    console.error("Database connection failed:", err);
  });
