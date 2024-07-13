const { StatusCodes } = require("http-status-codes");
const { userService } = require("../services");
const { ApiResponse } = require("../utils");

async function checkAuth(req,res,next){
    try {
        console.log("INSIDE MIDDLEWARE");
        const response = await userService.isAuthenticated(req.headers[`x-access-token`]);
        if(response){
            req.user = response; //setting the user id in the req object
            next();
        }
    } catch (error) {
        return res
                .status(StatusCodes.BAD_REQUEST)
                .json(
                    new ApiResponse(
                        StatusCodes.BAD_REQUEST,
                        {error: error.message},
                        "Token Error"
                    )
                );
    }
}

async function isAdmin(req, res, next){
    const response = await userService.isAdmin(req.user.id);
    if(!response){
        return res
                .status(StatusCodes.UNAUTHORIZED)
                .json(
                    new ApiResponse(
                        StatusCodes.UNAUTHORIZED,
                        "Unauthorized Access"
                    )
                );
    }
    next();
}

module.exports = {
    checkAuth,
    isAdmin
}