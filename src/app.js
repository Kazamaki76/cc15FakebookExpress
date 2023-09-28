require('dotenv').config();
const express = require("express");
const cors  = require("cors");

const notFoundMiddleware = require("./middleware /not-found");
const errorMiddleware = require("./middleware /error");
const rateLimitMiddleware = require("./middleware /rate-limit-middleware")

const app = express();


app.use(cors());
app.use(rateLimitMiddleware); //  ทำงานเป็นลำดัย 
app.use(express.json());

app.use(notFoundMiddleware);
app.use(errorMiddleware);


const PORT = process.env.PORT || "5000";
app.listen(PORT, () => console.log(`server running on port : ${PORT}`));

