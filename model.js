const mongoose = require('mongoose');

const Model = mongoose.model('Model', {
    '_id': mongoose.Schema.Types.ObjectId, user_id: String,
    'uri': String, access_time: mongoose.Schema.Types.Date,
    'request_method': String, 'user_agent': String
});

module.exports = Model;