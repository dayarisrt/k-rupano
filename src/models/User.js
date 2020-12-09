const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    dni: { type: String, required: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    user_name: { type: String, required: true },
    email: { type: String, required: true },
    pass: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rol: { type: Schema.Types.ObjectId, ref: 'Rol', required: true }
});

UserSchema.methods.encryptPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(pass, salt);
    return hash;
}

UserSchema.methods.matchPassword = async function (pass){
    return await bcrypt.compare(pass, this.pass);
}

module.exports = mongoose.model('User', UserSchema)