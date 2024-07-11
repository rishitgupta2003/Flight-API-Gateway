const brcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../config");

function passwordCheck(inputPassword, cryptPass){
    try{
        return brcrypt.compareSync(inputPassword, cryptPass);
    }catch(error){
        console.log(error);
        throw error
    }
}

function createToken(data){
    try{
        return jwt.sign(
            data,
            ServerConfig.JWT_SECRET,
        )
    }catch(error){
        console.log(error);
        throw error;
    }
}

function verifyToken(token){
    try{
        return jwt.verify(
            token,
            ServerConfig.JWT_SECRET
        )
    }catch(error){
        console.log(error);
        throw error;
    }
}

function generateIdempotencyCode(data){
    try{
        return jwt.sign(
            data,
            ServerConfig.JWT_SECRET
        )
    }catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
    passwordCheck,
    createToken,
    verifyToken,
    generateIdempotencyCode
}