const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

module.exports = {
  uploadProfileImage: async (file, publicId = null) => {
    const obj = {
      resource_type: 'image'
    };
    if (publicId) {
      obj.public_id = publicId;
      obj.overwrite = true;
      obj.secure = true;
    }
    const response = await cloudinary.v2.uploader.upload(file.path, obj);
    const { secure_url: securedUrl, public_id: publicIdKey } = response;
    return {
      url: securedUrl,
      publicId: publicIdKey
    };
  }
};
