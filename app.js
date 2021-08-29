const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  // PART I
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // PART II formatting "data" that is required for mailchimp
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data); // stringify above data

  // for batch subscribe and unsubscribe - endpoint/lists/{list_id}
  const url = "https://us5.api.mailchimp.com/3.0/lists/29b48a69ab";

  // options' in - https.request(url[, options][, callback])
  const options = {
    method: "POST",
    auth: "vivekprajapati2048:d880d8b06fc66e4e93d4317366c0ecb9-us5"
  }

  // save into constant - 'request', to send it to mailchimp's server
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  });

  // POST to Mailchimp Servers
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});

// API Key
// d880d8b06fc66e4e93d4317366c0ecb9-us5

// Audiance Id, List ID, Vivek Newsletter ID
// 29b48a69ab


// 'https://<dc>.api.mailchimp.com/3.0/'
