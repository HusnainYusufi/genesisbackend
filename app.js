const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 5012;
const fs = require("fs");
const server = require("http").createServer(app);
const DATABASE_URL ="mongodb://nJijaQgenesiszoaq:keDJh4kgoURgenesisOp3mVbbt@158.220.104.228:24812/genesismatrimony";
//const DATABASE_URL = "mongodb://localhost:27017";
const cors = require("cors");
const connectdb = require("./db/connect.js");
const jwt = require("jsonwebtoken");
const handleSuccess = require("./HandleFunction/handleSuccess.js");
const mime = require("mime");
const handleErr = require("./HandleFunction/HandleErr");
const path = require("path");
const UserApi = require('./routes/userApi.js');
const CommunityApi = require('./routes/communityApi');
const PreferenceApi = require('./routes/preferenceApi');

connectdb(DATABASE_URL);
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/uploads/")));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Get File
app.get("/api/getFile:path", (req, res) => {
  try {
    var file = __dirname + "/uploads/" + req.params.path;

    var filename = path.basename(file);
    var mimetype = mime.getType(file);
    //console.log('file->', file)
    res.setHeader("Content-disposition", "attachment; filename=" + filename);
    res.setHeader("Content-type", mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  } catch (error) {
    return res.json(handleErr(error));
  }
});
// app.use('/user' , UserApi);
app.use('/community' , CommunityApi);
app.use('/preference' , PreferenceApi);

app.get("/", (req, res) => {
    res.send("<h1>hello from Genesis Backend</h1>");
  });
  
server.listen(port, () => {
    console.log("Server listening at port %d", port);
});
  