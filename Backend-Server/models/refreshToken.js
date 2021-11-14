const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({

    token:{
        type: String,
        unique: true
    }
});

const refreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = refreshToken;
