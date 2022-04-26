import mongoose, { Schema } from 'mongoose'

mongoose.set('debug', true);
const { Schema } = mongoose;


const User = new Schema({
    name: { type: String, required: true},
    password: { type: String, required: true},
    roles: [{type: String, ref: 'Role'}]
})

export default mongoose.model('USERS', User, 'users');