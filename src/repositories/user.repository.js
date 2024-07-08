const CrudRepository = require("./crud.repository");
const { Logger } = require("../config");
const { User } = require("../models");
const { Op } = require("sequelize");

class UserRepostiory extends CrudRepository{
    constructor(){
        super(User);
    }
    
    async findUser(email){
        try {
            const user = await User.findOne(
                {
                    where: {
                        [Op.or]: {
                            email: {
                                [Op.eq]: email
                            },
                            username: {
                                [Op.eq]: email
                            }
                        }
                    }
                }
            );
    
            return user;
        } catch (error) {
            Logger.error("Something Went Wrong in Fetching User", {});
            throw error;
        }
    }
}

module.exports = UserRepostiory;