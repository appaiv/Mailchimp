const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const https = require("https");
const request = require("request");

const app = express();

// body-parser is deprecated
// now its functionalities come from express
app.use(express.urlencoded({extended: true}));

// get: reponse to browser's resources request
// response for the main page (/ or /signup.html) request
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// post: response to browser's data insertion request
// response for insertion of data coming from the main page (/ or /signup.html)
app.post("/", function(req, res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  const listId = "bb7fc22778";
  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: email
  };
  console.log(subscribingUser.firstName);

  mailchimp.setConfig({
    apiKey: "f45d60185e91b19580cf89dcf0b085a6-us14",
    server: "us14",
  });

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    console.log(
      "Successfully added contact as an audience member. The contact's id is ${response.id}."
    );
  }

  run();
});



// async function run() {
//   const response = await mailchimp.ping.get();
//   console.log(response);
// }
//
// run();
