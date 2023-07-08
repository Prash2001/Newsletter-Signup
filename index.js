const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { subscribe } = require("diagnostics_channel");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public/"));
app.listen(process.env.PORT || 3000,function(){
  console.log("APP is live on port 3000");
});
app.get('/', function(req, res){
res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members:[
      {
        email_address: email,
        status:"subscribed",
        merge_fields: {
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/f08b068989";
  const options ={
    method : "POST",
    auth:"prash:b4e8877fc1f78e0042b52c57d7b86502-us10"
  }
  const request = https.request(url, options, function(response){
    
    response.on("data", function(data){
      console.log(JSON.parse(data).error_count);
      //console.log(response);
      if(response.statusCode ===200 && JSON.parse(data).error_count<=0){
        res.sendFile(__dirname+"//success.html");
      }
      else{
        res.sendFile(__dirname+"//failure.html");
      }
    })
  });
request.write(jsonData);
request.end();
});
app.get("/failure", function(req,res){
  res.redirect("/");
})
//Audience id
//f08b068989
//API Key
//b4e8877fc1f78e0042b52c57d7b86502-us10