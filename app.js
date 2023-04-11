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
const ChatApi = require('./routes/chatApi.js');
const Chat = require('./models/chat');
const AdminApi = require('./routes/adminApi.js');

connectdb(DATABASE_URL);
// const corsOptions ={
//   "origin": "*",
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// }
//app.use(cors(corsOptions))
const allowedOrigins = ['https://metrimony.tech-east.com.pk', 'http://localhost:3000']; 
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
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

const io = require('socket.io')(server, {
  path: '/custom',
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  timeout: 20000,
  autoConnect: true,
  query: {},
  // options of the Engine.IO io
  upgrade: true,
  forceJSONP: false,
  jsonp: true,
  forceBase64: false,
  enablesXDR: false,
  timestampRequests: true,
  timestampParam: 't',
  policyPort: 843,
  transports: ['polling', 'websocket'],
  transportOptions: {},
  rememberUpgrade: false,
  onlyBinaryUpgrades: false,
  requestTimeout: 0,
  protocols: [],
  // options for Node.js
  agent: false,
  pfx: null,
  key: null,
  passphrase: null,
  cert: null,
  ca: null,
  ciphers: [],
  rejectUnauthorized: false,
  perMessageDeflate: true,
  forceNode: false,
  localAddress: null,
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

app.use('/user' , UserApi);
app.use('/community' , CommunityApi);
app.use('/preference' , PreferenceApi);
app.use('/chat' , ChatApi);
app.use('/admin' , AdminApi);

io.engine.on("connection_error", (err) => {
  console.log(err);
});

io.on('connection', (socket) => {
  io.emit('connecteddd', {
    message: "yahoooo"
  })
  socket.on('newMessageDone', (data) => {
    console.log('oidhfsdf===>', data)
    io.emit('messageSentSuccess', "Han mehdi mill gya hai");
  })

  socket.on('newMessage', (data) => {
    console.log(data)
    if (data.id && data.messageType !== undefined && data.messageSender !== undefined && data.sender !== undefined) {
      let { id, messageType, messageSender, sender } = data
      let message = {}
      if (messageType === 0) {
        if (data.text) {
          message = {
            text: data.text,  
            messageType,
            messageSender,
            sender
          }
        }
        else {
          let response = {
            data: "Message text is required",
            message: "Failed"
          }
          return io.emit('messageSent', response)
        }
      }
      else if (messageType === 1) {
        if (data.filePath) {
          message = {
            filePath: data.filePath,
            messageType,
            messageSender,
            sender

          }
        }
        else {
          let response = {
            data: "File path is required",
            message: "Failed"
          }
          return io.emit('messageSent', response)
        }
      }
      else if (messageType === 2) {
        if (data.purchaseOffer) {
          message = {
            purchaseOffer: data.purchaseOffer,
            messageType,
            messageSender,
            sender,
            offerStatus: "pending"
          }
        }
        else {
          let response = {
            data: "Purchase offer is required",
            message: "Failed"
          }
          return io.emit('messageSent', response)
        }
      }
      Chat.findByIdAndUpdate(id, { $push: { messages: message }, lastMessage: new Date() }, { new: true })
        .populate([
          {
            path: "sender",
            model: "users"
          },
          {
            path: "receiver",
            model: "users"
          }
          
        ]).exec((err, chat) => {
          if (err) {
            let response = {
              message: "Failed",
              data: err
            }
            io.emit('messageSent', response)
          }
          else {
            let response = {
              message: "Success",
              data: chat
            }
            io.emit('messageSent', response)
          }
        })
    }
    else {
      let response = {
        data: "Message details are required",
        message: "Failed"
      }
      io.emit('messageSent', response)
    }
  })
  /**
   {
"id":"6284f25814b90659f96ad204",
"messageId":"62878337d21e8c0537d4bf07"
}
   */
  //Accept Offer request

 
});

app.get("/", (req, res) => {
    res.send("<h1>hello from Genesis Backend</h1>");
  });
  
server.listen(port, () => {
    console.log("Server listening at port %d", port);
});
  