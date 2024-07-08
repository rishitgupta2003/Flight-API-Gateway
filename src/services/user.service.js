const { StatusCodes } = require("http-status-codes");
const { UserRepository, RoleRepository } = require("../repositories");
const { USER_ROLES_ENUMS, ApiError } = require("../utils");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = USER_ROLES_ENUMS;
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data){
    try{
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(ADMIN);
        user.addRole(role);
        return user;
    }catch(error){
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError'){
            let errExp = [];
            error.errors.forEach( (err) => {
                errExp.push(err.message);
            });

            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                errExp.toString()
            );
        }

        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "Cannot Create a new User"
        );
    }
}

module.exports = {
    createUser
}