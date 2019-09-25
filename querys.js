const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Model = require('./model');
dotenv.config();
mongoose.connect(process.env.MONGO_CONN_URL, {useNewUrlParser: true,useUnifiedTopology: true});

var time = new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
console.log('Querys from ',new Date(time).toISOString());
Model.aggregate([
    {
        $match: {
            access_time: {$gt: new Date(time)}
        }
    },
    {
        $group: {
            _id: '$request_method',
            count: { $sum: 1 }
        }
    }  
], function (err, result) {   
    if (err) {
        console.log(err);
    } else {
        console.group('Count acces by method');
        result.forEach((i)=>{
            console.log(i);
        });
        console.groupEnd();
    }
});

Model.aggregate([
    {
        $match: {
            access_time: {$gt: new Date(time)}
        }
    },
    {
        $group: {
            _id: '$user_id',
            count: { $sum: 1 }
        }
    }  
], function (err, result) {   
    if (err) {
        console.log(err);
    } else {
        console.group('Count acces by user');
        result.forEach((i)=>{
            console.log(i);
        });
        console.groupEnd();
    }
});

Model.aggregate([
    {
        $match: {
            access_time: {$gt: new Date(time)}
        }
    },
    {
        $group: {
            _id: '$uri',
            count: { $sum: 1 }
        }
    }  
], function (err, result) {   
    if (err) {
        console.log(err);
    } else {
        console.group('Access by URI');
        result.forEach((uri)=>{
            console.log(uri._id,uri.count);
            Model.aggregate([
                {
                    $match: {
                        access_time: {$gt: new Date(time)},
                        uri: uri._id
                    }
                },
                {
                    $group: {
                        _id: '$user_id',
                        count: { $sum: 1 }
                    }
                }  
            ], function (err, result) {   
                if (err) {
                    console.log(err);
                } else {
                    console.group('User access by URI');
                    result.forEach((user)=>{
                        console.log(user._id,uri._id,user.count, ((user.count/uri.count) *100)+"%");
                    });
                    console.groupEnd();
                    mongoose.connection.close();
                }
            });            
        });
        console.groupEnd();
        //mongoose.connection.close();
    }
});