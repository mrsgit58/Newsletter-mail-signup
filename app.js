//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https");

const app = express();

app.use(express.static("public"))

app.use(express.urlencoded({ extended: true }))


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    var jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/7e14f3729b";

    const options = {
        method: "POST",
        auth: "Anon:8c77d588fb4ade9cdad30d30b4988829-us1"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
            console.log(response.statusCode);
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })

    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(3001, function() {
    console.log("Server is running on port 3000");
})

//Mailchimp audience id 7e14f3729b
//Mailchimp API key: 8c77d588fb4ade9cdad30d30b4988829-us1