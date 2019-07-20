
'use strict';
const {google} = require('googleapis');
const express = require('express');
const app = express();
var server = require('http').createServer(app);
var access_token;
const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
var request = require('request');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
require("dotenv").config()

const JSON = require('circular-json');

const client = new google.auth.OAuth2(
   process.env.key1,
   process.env.key1,
   process.env.redirectUrl
);

var authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

app.get("/authorizeUrl", (req, res) => {
    res.redirect(authorizeUrl);
});

app.get("/getAccessToken", (req, res) => {
    client.getToken(req.query.code, (err, token) => {
        client.setCredentials(token);
        request({
            headers: {
                'Authorization': 'Bearer '+token.access_token,
                'Content-Type': 'application/x-www-form-urlencoded'
            },uri : "https://www.googleapis.com/gmail/v1/users/me/profile", method: 'GET'},(error, response, body)=>{
            res.send(JSON.parse(body).emailAddress)
        })
    });

});

