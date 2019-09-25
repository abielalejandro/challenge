const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var client  = mqtt.connect('ws://localhost:61614');
 
client.on('connect', function (err) {
  client.subscribe('presence', function (err) {
    if (err) {
      console.error(err);
    }
  })
});


app.post('/api/test', function (req, res) {
  client.publish('presence',JSON.stringify(req.body));
  res.json(true);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});