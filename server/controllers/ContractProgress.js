const ContractProgress = require("../models/ContractProgress");

// updateContractProgress
const updateContractProgress = async (req, res) => {
	// fetch contractId and progress from the request body
	const { contractId, progressStep } = req.body;
	//   fetch userId from the req.user object
	const userId = req.user.id;

	try {
		// Find the contract progress document for the user and contract
		let contractProgress = await ContractProgress.findOne({
			contractID: contractId,
			userId: userId,
		});

		if (!contractProgress) {
			// If contract progress doesn't exist, create a new one
			return res.status(404).json({
				success: false,
				message: "Contract progress Does Not Exist",
			});
		} else {
			// If contract progress exists, update the progress
			contractProgress.progress = progressStep;
		}

		// Save the updated contract progress
		await contractProgress.save();

		// return success response
		return res.status(200).json({ message: "Contract progress updated" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong while updating the contract progress",
			error: error.message,
		});
	}
};

module.exports = { updateContractProgress };
