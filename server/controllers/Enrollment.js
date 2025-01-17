const User = require("../models/User");
const Contract = require("../models/Contract");
const mailSender = require("../utils/mailSender");
const contractEnrollmentEmail = require("../utils/mailTemplates/contractEnrollmentEmail");
require("dotenv").config();

// enrollContract
const enrollContract = async (req, res) => {
	try {
		// fetch the contractId from the request params
		const { contractId } = req.params;

		// fetch the userId from the request user object
		const userId = req.user.id;

		// update the contract
		const enrolledContract = await Contract.findOneAndUpdate(
			{ _id: contractId },
			{ farmerEnrolled: userId,status: "Enrolled" },
			{ new: true }
		);
		if (!enrolledContract) {
			return res.status(404).json({
				success: false,
				message: "Contract not found",
			});
		}
		console.log("Enrolled Contract: ", enrolledContract);

		// update the user
		const enrolledUser = await User.findOneAndUpdate(
			{ _id: userId },
			{ $push: { contracts: contractId } },
			{ new: true }
		);
		console.log("Enrolled User: ", enrolledUser);

		// send the contract enrollment mail
		const emailResponse_ = await mailSender(
			enrolledUser.email,
			`Successfully Enrolled into ${enrollContract.contractName}`,
			contractEnrollmentEmail(
				enrollContract.contractName,
				`${enrolledUser.firstName} ${enrolledUser.lastName}`
			)
		);
		console.log("Email Response: ", emailResponse_);

		// send the success response
		return res.status(200).json({
			success: true,
			message: "Contract enrollment successful",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong while enrolling in the contract",
		});
	}
};

module.exports = { enrollContract };
