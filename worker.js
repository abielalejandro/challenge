const mqtt = require('mqtt');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_CONN_URL, {useNewUrlParser: true});

const Model = mongoose.model('Model', {
         '_id': mongoose.Schema.Types.ObjectId, user_id: String,
         'uri': String, access_time: mongoose.Schema.Types.Date,
         'request_method': String, 'user_agent': String
        });

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
        