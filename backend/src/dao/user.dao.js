import User from "../models/user.model.js"


export const findUserByEmail = async (email) =>{
    return await User.findOne({email})
}
export const findUserById = async (id) =>{
    return await User.findById(id)
}
export const createUser = async (name,email,password) =>{
    const user = new User({
        name,
        email,
        password,
    })
    const newUser = await user.save()
    console.log(newUser);
    console.log("User created");

   // await newUser.save()
    return newUser
}