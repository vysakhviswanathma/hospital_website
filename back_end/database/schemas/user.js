const mongoose = require('mongoose');

const { Schema } = mongoose;

const usersSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  resetCode: { type: String, default: false },
});

// usersSchema.pre('findOneAndDelete', function(next) {
//   // Remove all the assignment docs that reference the removed person.
//   this.model('emailVerificationsSchema').remove({ _user: this._id }, next);
// });

const usersModel = mongoose.model('users', usersSchema);

module.exports = usersModel;
