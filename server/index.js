const env = require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const fs = require("fs");
const { parse } = require("csv-parse");
const axios = require("axios");
const db = require("./db/connect");
const app = express();
const PORT = process.env.PORT || 5000;
const detail = require("./model/number");
const fsExtra = require("fs-extra");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const fetchNumberDetails = async (number) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: { apikey: process.env.API_KEY },
  };
  try {
    const { data } = await axios.get(
      `https://api.apilayer.com/number_verification/validate?number=${number}}`,
      requestOptions
    );
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};

//fetch a uniquie number detail

app.post("/upload", async (req, res) => {
  try {
    //get the numberArray
    const fileName = req.files.fisier;
    if (!req.files) {
      return res.status(400).json({ msg: "please upload a file" });
    }
    fileName.mv(`${__dirname}/files/${fileName.name}`, function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      console.log("successfully uploaded the file");
    });
    fs.createReadStream(`./files/${fileName.name}`)
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", async (row) => {
        const number = `+${row[0]}`;
        const data = await fetchNumberDetails(number);
        if (data) {
          await detail.create({ ...data });
        }
      })
      .on("error", (error) => {
        return res.status(400).json({ success: false, msg: error.message });
      });

    res.status(200).json({ msg: "success" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

app.get("/getdetails", async (req, res) => {
  try {
    const data = await detail.find();
    fsExtra.emptyDirSync("./files");
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    await detail.deleteMany();
    console.log("products are deleted");
    res.status(200).json({ success: true, msg: "database cleares" });
  } catch (error) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

const start = async () => {
  try {
    await db(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server Listening on port:${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
    console.log("Shutting down the server due to unhandled promise rejection");
    process.exit(1);
  }
};
start();
