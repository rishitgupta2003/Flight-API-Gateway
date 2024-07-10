const { userService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { asyncHandler, ApiResponse, ApiError } = require("../utils");

/*
    data : {
        name,
        username,
        email,
        password
    }
*/

const registerUser = asyncHandler(
    async(req, res) => {
        console.log("inside controller");
        try{
            const { name, username, email, password } = req.body;
            const response = await userService.createUser(
                {
                    name: name,
                    username: username,
                    email: email,
                    password: password
                }
            );

            return res
                    .status(StatusCodes.CREATED)
                    .json(
                        new ApiResponse(
                            StatusCodes.CREATED,
                            response,
                            "User Registered Successfully"
                        )
                    );
        }catch(error){
            throw new ApiError(
                error.status_code || StatusCodes.INTERNAL_SERVER_ERROR, error.message || "Something Went Wrong"
            );
        }
    }
)



const loginUser = asyncHandler(
    async(req, res) => {

    }
)


module.exports = {
    registerUser
}