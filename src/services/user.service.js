const { StatusCodes } = require("http-status-codes");
const { UserRepository, RoleRepository } = require("../repositories");
const { USER_ROLES_ENUMS, ApiError, Auth } = require("../utils");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = USER_ROLES_ENUMS;
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

/*
    data : {
        name,
        username,
        email,
        password,
    }
*/

async function createUser(data){
    try {
        const existingUser = await userRepository.findUser(data.email);
        if(existingUser) throw new ApiError(StatusCodes.BAD_REQUEST, "Email Already in Use");
        const user = await userRepository.create(data);
        return user;      
    } catch (error) {
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let errExp = [];
            error.errors.forEach((err) => {
                errExp.push(err.message);
            });
            throw new ApiError(StatusCodes.BAD_REQUEST, errExp.toString());
        }
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "User Cannot Be Created");
    }
}

/*
    data : {
        email,
        password
    }
*/
async function loginUser(data){
    try{
        const getUser = await userRepository.findUser(data.email);
        if(!getUser) throw new ApiError(StatusCodes.NOT_FOUND, "User Not Found | Check Email");
        if(!Auth.passwordCheck(data.password,getUser.password)) throw new ApiError(StatusCodes.FORBIDDEN, "Incorrect Password");
        const userData = {
            id: getUser.id,
            name: getUser.name,
            username: getUser.username,
            email: getUser.email,
            role: (getUser.role == 2) ? CUSTOMER : (getUser.role == 1) ? ADMIN : FLIGHT_COMPANY
        };
        const jwt = Auth.createToken(userData);
        return jwt;
    }catch(error){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something Went Wrong");
    }
}

async function addRoleToUser(data){
    try{
        const user = await userRepository.get(data.id);
        if(!user){
            throw new ApiError(StatusCodes.NOT_FOUND, "No such user found with the given id");
        }
        const role = await roleRepository.getRolebyName(data.role);
        if(!role){
            throw new ApiError(StatusCodes.NOT_FOUND, "No user found for this role");
        }
        user.addRole(role);
        return user;
    }catch(error){
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something Went Wrong");
    }
}

async function isAdmin(id){
    try {
        const user = await userRepository.get(id);
        if(!user){
            throw new ApiError(StatusCodes.NOT_FOUND, "No such user found with the given id");
        }
        const adminrole = await roleRepository.getRolebyName(ADMIN);
        if(!adminrole){
            throw new ApiError(StatusCodes.NOT_FOUND, "No user found for this role");
        }
        return user.hasRole(adminrole);
        
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

async function isAuthenticated(token){
    try {
        if(!token){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Missing JWT token");
        }
        const reponse = Auth.verifyToken(token);
        const user = await userRepository.get(reponse.id);
        if(!user){
            throw new ApiError(StatusCodes.NOT_FOUND, "No User found");
        }
        return user.id;
    } catch (error) {
        if(error instanceof AppError) throw error;
        if(error.name == 'JsonWebTokenError'){
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid JWT token");
        }
        if(error.name == 'TokenExpiredError'){
            throw new ApiError(StatusCodes.BAD_REQUEST, "JWT token expired");
        }
        console.log(error);
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong");
    }
}

module.exports = {
    createUser,
    loginUser,
    addRoleToUser,
    isAdmin,
    isAuthenticated
}