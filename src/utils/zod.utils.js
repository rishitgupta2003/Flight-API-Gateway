const zod = require("zod");
const { USER_ROLES_ENUMS } = require("../utils");
const { ADMIN, CUSTOMER, FLIGHT_COMPANY } = USER_ROLES_ENUMS;

const manageCreateUser = (Name, Username, Email, Password, Role) => {
    const name = zod.string().min(2);
    const username = zod.string().min(4);
    const password = zod.string().min(6);
    const email = zod.string().email();
    const role = zod.enum([ADMIN, CUSTOMER, FLIGHT_COMPANY]);

    return {
        data: {
            name: name.safeParse(Name).success,
            username: username.safeParse(Username).success,
            password: password.safeParse(Password).success,
            email: email.safeParse(Email).success,
            role: role.safeParse(Role).success
        },

        success: name.safeParse(Name).success &&  username.safeParse(Username).success && password.safeParse(Password).success
                 && email.safeParse(Email).success && role.safeParse(Role).success
    }
}

const manageLoginUser = (Email, Password) => {
    const email = zod.string.email();
    const password = zod.string().min(6);

    return { 
        data: {
            email: email.safeParse(Email),
            password: password.safeParse(Password)
        },
        success: email.safeParse(Email).success && password.safeParse(Password).success
    }
}

module.exports = {
    manageCreateUser,
    manageLoginUser
}