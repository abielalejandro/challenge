const mqtt = require('mqtt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Model = require('./model');
dotenv.config();

mongoose.connect(process.env.MONGO_CONN_URL, {useNewUrlParser: true});
var client  = mqtt.connect(process.env.MQ_CONN_URL);

client.on('connect', function (err) {
    client.subscribe('presence', function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('message', function (topic, message) {
    var instance = new Model(JSON.parse(message.toString()));
    instance.save(function (err) {
      if (err) return console.error(err);
    });
});    