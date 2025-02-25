// import express and create an instance of express
const express = require("express");
const app = express();

// import dotenv and configure it
require("dotenv").config();

// import all the routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const contractRoutes = require("./routes/Contract");
const offerRoutes = require("./routes/Offer");
const enrollmentRoutes = require("./routes/Enrollment");
const contactUsRoute = require("./routes/Contact");

const cookieParser = require("cookie-parser"); // import cookie-parser for parsing cookies
const cors = require("cors"); // import cors for enabling cors requests from the frontend
const { cloudinaryConnect } = require("./config/cloudinary"); // import cloudinaryConnect for connecting to cloudinary
const fileUpload = require("express-fileupload"); // import fileUpload for uploading files
const PORT = process.env.PORT || 4000; // define the port

// database connection
require("./config/database")();

// cloudinary connection
cloudinaryConnect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);

// mount the routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/contract", contractRoutes);
app.use("/api/v1/offer", offerRoutes);
app.use("/api/v1/enrollment", enrollmentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// default route
app.get("/", (req, res) => {
	res.send("Welcome to the Contract Farming API").json({
		success: true,
		message: "Welcome to the Contract Farming API",
	});
});

// listen to the port
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
