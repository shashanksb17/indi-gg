const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const { connection } = require("./config/database");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/users");
const booksRoutes = require("./routes/books");
const borrowRoutes = require("./routes/borrow");
const returnRoutes = require("./routes/return");
const searchRoutes = require("./routes/search");
const reccomendationRoutes = require("./routes/recommendation");

app.use("/users", authRoutes);
app.use("/books", booksRoutes);
app.use("/borrow", borrowRoutes);
app.use("/return", returnRoutes);
app.use("/search", searchRoutes);
app.use("/recommendation", reccomendationRoutes);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Library Management API",
    version: "1.0.0",
    description: "API documentation for the Library Management System",
  },
  server:[
    {
        api:"http://localhost:3000/"
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*users.js","./routes/*books.js","./routes/*search.js","./routes/*borrow.js","./routes/*return.js","./routes/*recommendation.js"], 
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("HOME PAGE OF Library Management System");
});

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
  console.log(`Server is running at port ${PORT}`);
});
