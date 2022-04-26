import mongoose, { Schema } from 'mongoose'

mongoose.set('debug', true);
const { Schema } = mongoose;

const Roles = new Schema({
    value: { type: String, required: true, default: "USER"}
})

export default mongoose.model('ROLES', Roles, 'roles');
