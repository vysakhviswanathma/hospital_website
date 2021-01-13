const EmailVerificationModel = require('../database').models.emailVerification;

// Helper function: Construct new data model
function createDataModel(model, data) {
  const Model = model;
  Object.keys(data).forEach((key) => {
    Model[key] = data[key];
  });
  return Model;
}

// Save Email Verification Token
const saveToken = async (data) => {
  const emailVerificationModel = new EmailVerificationModel();
  const doc = await createDataModel(emailVerificationModel, data).save();
  return doc;
};

// Lookup for a valid id and token combination
const validateToken = async (data) => {
  const doc = await EmailVerificationModel.findOne({ _id: data.id });
  return doc;
};

// Lookup for a valid id and token combination
const deleteToken = async (emailVerificationId) => {
  const data = {
    _id: emailVerificationId,
  };

  const doc = await EmailVerificationModel.deleteOne(data);
  return doc;
};

module.exports = {
  saveToken,
  validateToken,
  deleteToken,
};
