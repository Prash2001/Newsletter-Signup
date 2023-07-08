//importing required modules
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require("dotenv").config();
const { subscribe } = require("diagnostics_channel");
const app = express();
//bodyparser for converting request params to JSON
app.use(bodyParser.urlencoded({ extended: true }));
//All static files are stored in public folder
app.use(express.static("public/"));
//using process.env.port, because if we are hoisting our application on third party server, random port may get selected by thread.
app.listen(process.env.PORT || 3000, function () {
  console.log("APP is live on port 3000");
});
//rendering signup form
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//handling data posted by user
app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  //URL to connect to Mail Chimp API
  const url = "https://us10.api.mailchimp.com/3.0/lists/f08b068989";
  // Secret key is part of .env file
  const options = {
    method: "POST",
    auth: "prash:" + process.env.SECRET_KEY,
  };
  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode === 200 && JSON.parse(data).error_count <= 0) {
        res.sendFile(__dirname + "//success.html");
      } else {
        res.sendFile(__dirname + "//failure.html");
      }
    });
  });
  request.write(jsonData);
  request.end();
});

//Handling failure case(if user is already signed up then giving him appropriate message)
app.get("/failure", function (req, res) {
  res.redirect("/");
});
