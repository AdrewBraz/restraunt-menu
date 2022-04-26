import User from "../models/users";
import Roles from '../models/roles'
import bcrypt from 'bcryptjs'

const registration = async (_req, reply) => {
    try{
        const candidate = await User.findOne({userName})
        if(candidate){
            throw new Error(`User already exist`)
        }
        const hashPassword = bcrypt.hashSync(password, 6);
        const userRole = Roles.findOne({ value: 'USER'})
        const user = new User({ name: userName, password: hashPassword, roles: [userRole.value]})
        await user.save()
        reply.send({ message: 'Пользователь успешно зарегистирован', status: true })
    }
    catch(e) {
      console.log(e)
      reply.send({ message: e, status: true })
    }
  }

export { registration }