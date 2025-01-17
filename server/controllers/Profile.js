const mongoose = require("mongoose");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Contract = require("../models/Contract");
const ContractProgress = require("../models/ContractProgress");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

// update profile (as profile is created when user is created with null values)
const updateProfile = async (req, res) => {
	try {
		// fetch data from request body
		const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;

		// fetching userId from the request passed as payload in the token after decoding
		const userId = req.user.id;

		// check if all fields are provided (validate)
		if (!gender || !contactNumber || !userId) {
			return res.status(403).json({
				success: false,
				message: "All fields are required",
			});
		}

		// find profile using userDetails
		const userDetails = await User.findById(userId);
		const profileId = userDetails.additionalDetails;
		const profileDetails = await Profile.findById(profileId);

		// update the profile
		profileDetails.dateOfBirth = dateOfBirth;
		profileDetails.about = about;
		profileDetails.gender = gender;
		profileDetails.contactNumber = contactNumber;
		await profileDetails.save();

		// find the updated profile details
		const updatedProfileDetails = await User.findById(userId)
			.populate("additionalDetails")
			.exec();

		// return success response
		res.status(200).json({
			success: true,
			profile: profileDetails,
			message: "Profile updated successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message:
				("Something went wrong while updating the profile", error.message),
		});
	}
};

// deleteAccount
// Explore -> how can we schedule the deletion of the account after a certain period of time : hint -> use setTimeout
const deleteAccount = async (req, res) => {
	try {
		// fetching userId from the request passed as payload in the token after decoding
		const userId = req.user.id;

		// fetch user details and validate
		const userDetails = await User.findById(userId);
		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		// delete profile
		await Profile.findByIdAndDelete({
			_id: new mongoose.Types.ObjectId(userDetails.additionalDetails),
		});

		// check if the user has any contracts
		if (userDetails.contracts.length > 0) {
			res.status(403).json({
				success: false,
				message: "Cannot delete account with active contracts",
			});
		}

		// delete user
		await User.findByIdAndDelete(userId);

		// delete contract progress
		await ContractProgress.deleteMany({ userId: userId });

		// return success response
		res.status(200).json({
			success: true,
			message: "Account deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message:
				("Something went wrong while deleting the account", error.message),
		});
	}
};

// getUserDetails
const getUserDetails = async (req, res) => {
	try {
		// fetching userId from the request passed as payload in the token after decoding
		const userId = req.user.id;

		// fetch user details
		const userDetails = await User.findById(userId)
			.populate("additionalDetails")
			.exec();

		// return success response
		res.status(200).json({
			success: true,
			userDetails: userDetails,
			message: "User details fetched successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong while fetching the user details",
		});
	}
};

//  updateSupportingDocuments
const updateSupportingDocuments = async (req, res) => {
	try {
		// fetch supporting documents from the request and userId from the request passed as payload in the token after decoding
		const supportingDocuments = req.files.supportingDocuments;
		const userId = req.user.id;

		// upload the supporting documents to cloudinary
		const documents = await uploadFileToCloudinary(
			supportingDocuments,
			process.env.FOLDER_NAME,
			1000,
			1000
		);
		console.log("documents: ", documents);

		// update the user with the supporting documents
		const updatedProfile = await User.findByIdAndUpdate(
			{ _id: userId },
			{
				supportingDocuments: documents.secure_url,
				// mark the user back to unapproved
				approved: false,
			},
			{ new: true }
		);

		// return success response
		res.status(200).json({
			success: true,
			updatedProfile: updatedProfile,
			message: `Supporting Documents Updated successfully`,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message:
				"Something went wrong while updating the supporting documents",
		});
	}
};

// getEnrolledContracts
const getEnrolledContracts = async (req, res) => {
	try {
		// fetching userId from the request passed as payload in the token after decoding
		const userId = req.user.id;

		// fetch user details
		let userDetails = await User.findOne({
			_id: userId,
		})
			.populate({ path: "contracts" })
			.exec();

		// validate user details
		if (!userDetails) {
			return res.status(400).json({
				success: false,
				message: `Could not find user with id: ${userId}`,
			});
		}

		// return success response
		return res.status(200).json({
			success: true,
			data: userDetails.contracts,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong while fetching the enrolled contracts",
		});
	}
};

// contractorDashboard
const contractorDashboard = async (req, res) => {
	try {
		// Fetch all contracts by the contractor and populate the farmerEnrolled field or the offer submitted field
		const contractDetails = await Contract.find({ contractor: req.user.id })
			.populate({ path: "farmerEnrolled" })
			.populate({ path: "offerSubmitted" })
			.exec();

		res.status(200).json({
			success: true,
			contracts: contractDetails,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went while fetching the contractor dashboard",
		});
	}
};

// farmerDashboard
const farmerDashboard = async (req, res) => {
	try {
		// Fetch all ongoing contracts by the farmer and offer submitted field
		const contractDetails = await Contract.find({ farmerEnrolled: req.user.id });

		const offerSubmitted = await Contract.find({ offerSubmitted: req.user.id });

		res.status(200).json({
			success: true,
			ongoingContracts: contractDetails,
			offerSubmitted: offerSubmitted,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went while fetching the farmer dashboard",
		});
	}
};

module.exports = {
	updateProfile,
	deleteAccount,
	getUserDetails,
	updateSupportingDocuments,
	getEnrolledContracts,
	contractorDashboard,
	farmerDashboard,
};
