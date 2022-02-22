const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extend: true}));

// response to a get request from the browser for a resource that in this case
// is the signup.html page
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// Post request to a new subscriber
app.post("/", function(req, res){
  // using bodyParser feature to access the body elements by their name property.
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

// model of the object that Mailchimp waits with a subscriber data.
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

// parse the object to JSON string
  const jsonData = JSON.stringify(data);

// url with the campaign code
  const url = 'https://us14.api.mailchimp.com/3.0/lists/bb7fc22778a';

// tells Mailchimp the kind of request and the data sent to authenticate
  const options = {
    method: "POST",
    auth: "areop1:f45d60185e91b19580cf89dcf0b085a6-us14"
  }

// send the url and the data to authenticate and wait for a response
  const request = https.request(url, options, function(response){

    // if the conncection with the API without erros
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    // if there is any error, as: wrong apiKey or audience number
    else{
      res.sendFile(__dirname + "/failure.html");
    };

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

// efectivelly send the data to the API server
  request.write(jsonData);

  // inform that the sending ended
  request.end();
});

// Post request when the subscribe fails.
// the callback function uses the redirect method to back to the signup page
// it redirects from the route /failure to the app.get("/", ... ) that send the
// the file signup.html, the home page ("/")
app.post("/failure", function(req, res){
  res.redirect("/");
});

// process.env.PORT: the port value will be determined by the heroku system
// but when it is running locally, the port will be 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Listen on port 3000");
});

// apiKey - f45d60185e91b19580cf89dcf0b085a6-us14
// audience id - bb7fc22778
