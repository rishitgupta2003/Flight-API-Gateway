const { StatusCodes } = require("http-status-codes");
const { Zod, asyncHandler, ApiError } = require("../utils");

const createUserMiddleware = asyncHandler(
    async(req, res, next) => {
        console.log("inside Middleware")
        try{
            const { name, username, email, password } = req.body;
            const response = Zod.manageCreateUser(name, username, email, password);
            if(!response.success){
                throw new ApiError(StatusCodes.BAD_REQUEST, JSON.stringify(response.data));
            }
            next();
        }catch(error){
            throw new ApiError(
                error.status_code || StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Something Went Wrong"
            );
        }
    }
)


const loginUserMiddleware = asyncHandler(
    async(req, res, next) => {
        console.log("inside Middleware")
        try{
            const {email, password } = req.body;
            const response = Zod.manageLoginUser(email, password);
            if(!response.success){
                throw new ApiError(StatusCodes.BAD_REQUEST, JSON.stringify(response.data));
            }
            next();
        }catch(error){
            throw new ApiError(
                error.status_code || StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Something Went Wrong"
            );
        }
    }
)

module.exports = {
    createUserMiddleware,
    loginUserMiddleware
};