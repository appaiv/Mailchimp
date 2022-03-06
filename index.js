const express = require("express");
const https = require("https");
const request = require("request");

const app = express();

app.use(express.static("public"));
// body-parser is deprecated
// now its functionalities come from express
app.use(express.urlencoded({extended: true}));

// get: reponse to browser's resources request
// response for the main page (/ or /signup.html) request
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// post: response to browser's data insertion request------- data object --------
// response for insertion of data coming from the main page (/ or /signup.html)
app.post("/", function(req, res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  // ------- data object --------
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };
  // ------- end of object --------

  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/your-list-id";

  const options = {
    method: "POST",
    auth: "areop1:your-private-key-usX"
  }

  const request = https.request(url, options, function(response){

    // statusCode = 200 (Successfull connection)
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

// post to failure route
// when there is an error to subscribe the failure.html is shown
// this post allows to return to the main page through the button
app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port {process.env.PORT}.");
});
