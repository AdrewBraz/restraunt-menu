import User from "../models/users";
import Roles from '../models/roles'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

const generateAccessToken = (id, roles) => {
  const payload = { id, roles }
  return jwt.sign(payload, secret, { expiresIn: '12h'})
}

const registration = async (body, reply) => {
  const {name, password} = body
  let message;
  let status;
    try{
        const candidate = await User.findOne({name})
        if(candidate){
            throw new Error('Пользователь с таким именем уже существует')
        }
        const hashPassword = bcrypt.hashSync(password, 6);
        const userRole = Roles.findOne({ type: 'USER'})
        console.log(userRole)
        const user = new User({ name: name, password: hashPassword, roles: [userRole.value]})
        await user.save()
        message = 'Пользователь успешно зарегистирован'
        status = true
    }
    catch(e) {
     message = e.message;
     status = false
    } finally{
      console.log(message, status)
      await reply.send({message, status})
    }
}

const login = async (body, reply) => {
  let message;
  let status;
  const { name, password } = body;
  try{
    const user = await User.findOne({name});
    if(!user){
      throw new Error(`Такого пользователя не существует`)
    }
    const validateUser = bcrypt.compareSync(password, user.password)
    if(!validateUser){
      throw new Error(`Введен неверный пароль`)
    }
    const token = generateAccessToken(user._id, user.roles)
    message = `Приветствую ${user.name}`
    status = true
  } catch(e) {
    message = e.message;
    status = false;
  } finally {
    await reply.send({message, status, token})
  }
}

export { registration }