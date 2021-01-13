const UserModel = require('../database').models.user;

// Helper function: Construct new data model
function createDataModel(model, data) {
  const Model = model;
  Object.keys(data).forEach((key) => {
    Model[key] = data[key];
  });
  return Model;
}

// Create user
const createUser = async (data) => {
  const { email } = data;
  const filter = { email, isVerified: false };
  await UserModel.findOneAndDelete(filter);
  const newUserModel = new UserModel();
  const doc = await createDataModel(newUserModel, data).save();
  return doc;
};

/**
 * Find user
 * @param {object} data
 * @returns {object} doc
 */
const findUser = async (data) => {
  const doc = await UserModel.findOne(data);
  return doc;
};

// Update user verified or not
const updateIsVerified = async (data) => {
  const { userId, isVerified } = data;
  const update = { isVerified };
  const doc = await UserModel.findByIdAndUpdate(userId, update);
  return doc;
};

// Update Password
const updatePassword = async (data) => {
  const { id, password } = data;
  const filter = {
    password,
  };
  const doc = await UserModel.findByIdAndUpdate(id, filter);
  return doc;
};

// update
const update = async (data) => {
  const { id, filter } = data;
  const doc = await UserModel.findByIdAndUpdate(id, filter);
  return doc;
};

module.exports = {
  createUser,
  findUser,
  updateIsVerified,
  updatePassword,
  update,
};
