const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dgbkufw6z', 
    api_key: '465482735986256', 
    api_secret: 'GEdoIVrqx21m_i_x-PaqvGDl1c8' 
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}