const CrudRepository = require("./crud.repository");
const { Logger } = require("../config");
const { Role } = require("../models");

class RoleRepository extends CrudRepository{
    constructor(){
        super(Role);
    }

    async getRoleByName(name){
        try {
            const role = await Role.findOne(
                {
                    where: {
                        name: name
                    }
                }
            )
    
            return role;
        } catch (error) {
            Logger.error(`Something Went Wrong ${error.message}`, {});
            throw error;
        }
    }
}

module.exports = RoleRepository;