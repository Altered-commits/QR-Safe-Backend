//Load critical stuff from .env file
import { configDotenv } from "dotenv";
configDotenv();

//Node imports
import express, { json } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
//My imports
import apiRoutes from "./routes/qrSafeApiRoutes.js";
import statusCodes from "./constants/statusCodes.js";

//Handles everything
const app = express();

//Get the port from .env file
const PORT = process.env.PORT;

//--------------------MIDDLEWARE--------------------
app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 30,
    message: "Too many requests from this IP. please try again after 5 minutes."
}));             //Rate limited to 30 requests within 5 min frame. Default Status Code: 429
app.use(json()); //Parse incoming data to JSON
app.use(cors()); //Enable Cross-Origin Resource Sharing for all routes (for now)

//--------------------MAIN ROUTES--------------------
app.use("/api", apiRoutes);

//--------------------DEFAULT ROUTE--------------------
app.get("/", (req, res) => {
    res.send("Welcome to the QR-Safe Backend.");
});

//--------------------INVALID ROUTES--------------------
app.all("*", (req, res) => {
    //Any other route other than the ones defined above gets an error 404
    res.status(statusCodes.NOT_FOUND).json({
        error: "ERROR 404. Invalid API route."
    });
});

//--------------------SERVER START--------------------
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});