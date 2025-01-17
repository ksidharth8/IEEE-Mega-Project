const cloudinary = require("cloudinary").v2;

const uploadFileToCloudinary = async (file, folder, quality) => {
	const options = { folder: folder };
	if (quality) {
		options.quality = quality;
	}
	options.resource_type = "auto";
	return await cloudinary.uploader.upload(file.tempFilePath, options);
};

module.exports = { uploadFileToCloudinary };
