import express from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(port, (req, res) => {
    console.log("listening in port " + port);
})