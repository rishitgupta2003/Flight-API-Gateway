const zod = require("zod");

const manageCreateUser = (Name, Username, Email, Password)  => {
    const name = zod.string().min(2);
    const username = zod.string().min(4);
    const password = zod.string().min(6);
    const email = zod.string().email();

    return {
        data: {
            name: name.safeParse(Name).success,
            username: username.safeParse(Username).success,
            password: password.safeParse(Password).success,
            email: email.safeParse(Email).success,
        },

        success: name.safeParse(Name).success &&  username.safeParse(Username).success && password.safeParse(Password).success
                 && email.safeParse(Email).success
    }
}

const manageLoginUser = (Email, Password) => {
    const email = zod.string().email();
    const password = zod.string().min(6);

    return { 
        data: {
            email: email.safeParse(Email).success,
            password: password.safeParse(Password).success
        },
        success: email.safeParse(Email).success && password.safeParse(Password).success
    }
}

module.exports = {
    manageCreateUser,
    manageLoginUser
}