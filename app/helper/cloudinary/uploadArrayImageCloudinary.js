const cloudinary = require('../../middleware/cloudinary');
const fs = require('fs');

const uploadArrayImageCloudinary = async (images) =>{
  try {
    const resultUploadCloudinary = [];
    for(const image of images){
      const secure_url = (await cloudinary.uploader.upload(image.path)).secure_url;
      resultUploadCloudinary.push(secure_url);
      fs.unlinkSync(image.path);
    }
    return resultUploadCloudinary;
  } catch (error) {
    console.log(error);
    throw error;    
  }
}

module.exports = uploadArrayImageCloudinary;