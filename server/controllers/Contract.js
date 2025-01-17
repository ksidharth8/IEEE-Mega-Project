const Contract = require("../models/Contract");
const User = require("../models/User");
const ContractProgress = require("../models/ContractProgress");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
const Offer = require("../models/Offer");
require("dotenv").config();

// getAllContracts
const getAllContracts = async (req, res) => {
	try {
		// fetch all contracts
		const contracts = await Contract.find(
			{ status: "published" },
			{
				contractName: true,
				proposedPrice: true,
				contractor: true,
			}
		)
			.populate("contractor")
			.exec();

		// return success response
		res.status(200).json({
			success: true,
			data: contracts,
			message: "Contracts fetched successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong while fetching the contracts",
		});
	}
};

// createContract
const createContract = async (req, res) => {
	try {
		// fetch userId from the request object
		const userId = req.user.id;

		// fetch data from the request body
		const {
			contractName,
			contractDescription,
			location,
			proposedPrice,
		} = req.body;

		// check if all fields are provided (validate)
		if (
			!contractName ||
			!contractDescription ||
			!location ||
			!proposedPrice
		) {
			return res.status(403).json({
				success: false,
				message: "All fields are required",
			});
		}

		// check for contractor (for storing contractor Object ID)
		const contractorDetails = await User.findById(userId, {
			accountType: "Contractor",
		});
		console.log("Contractor Details: ", contractorDetails);
		// ToDo: Check if the id of user and contractor is same

		if (!contractorDetails) {
			return res.status(404).json({
				success: false,
				message: "Contractor Details not found",
			});
		}

		// create entry for contract in the database
		const newContract = await Contract.create({
			contractName: contractName,
			contractDescription: contractDescription,
			contractor: contractorDetails._id,
			proposedPrice: proposedPrice,
			status: status,
		});

		// add the new contract to the user schema of contractor
		await User.findByIdAndUpdate(
			{ _id: contractorDetails._id },
			{ $push: { contracts: newContract._id } },
			{ new: true }
		);

		// return success response
		res.status(200).json({
			success: true,
			message: "Contract created successfully",
			contract: newContract,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message:
				("Something went wrong while creating the contract", error.message),
		});
	}
};

// updateContract
const updateContract = async (req, res) => {
	try {
		// fetch contractId from the request body
		const { contractId, updates } = req.body;

		// fetch contract details
		const contract = await Contract.findById(contractId);

		// validation
		if (!contract) {
			return res.status(404).json({ error: "Contract not found" });
		}

		// Update only the fields that are present in the request body
		for (const key in updates) {
			if (updates.hasOwnProperty(key)) {
				contract[key] = updates[key];
			}
		}

		// save the updated contract
		await contract.save();

		// fetch the updated contract details
		const updatedContract = await Contract.findOne({
			_id: contractId,
		})
			.populate({ path: "contractor" })
			.exec();

		// return success response
		res.json({
			success: true,
			message: "Contract updated successfully",
			data: updatedContract,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong while updating the contract",
			error: error.message,
		});
	}
};

// getContractDetails
const getContractDetails = async (req, res) => {
	try {
		// fetch contractId from the request body
		const { contractId } = req.body;

		// fetch userId from the request object
		const userId = req.user.id;

		// fetch contract details
		const contractDetails = await Contract.find({ _id: contractId })
			.populate({
				path: "contractor",
				populate: { path: "additionalDetails" },
			})
			.exec();

		// fetch contract progress
		const contractProgress = await ContractProgress.findOne({
			contractID: contractId,
			userId: userId,
		});
		console.log("contractProgress : ", contractProgress);

		// validation
		if (!contractDetails) {
			return res.status(404).json({
				success: false,
				message: ("Contract not found with the contract id", contractId),
			});
		}

		// checking if the contract is in Draft status
		if (contractDetails.status === "Draft") {
			return res.status(403).json({
				success: false,
				message: "Accessing a draft contract is forbidden",
			});
		}

		// return success response
		res.status(200).json({
			success: true,
			data: [contractDetails, contractProgress.progressStep],
			message: "Contract details fetched successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message:
				("Something went wrong while fetching the contract details",
				error.message),
		});
	}
};

// getContractorContracts
const getContractorContracts = async (req, res) => {
	try {
		// Get the contractor ID from the authenticated user or request body
		const contractorId = req.user.id;

		// Find all contracts belonging to the contractor
		const contractorContracts = await Contract.find({
			contractor: contractorId,
		})
			.sort({ createdAt: -1 })
			.populate("offersSubmitted")
			.exec();

		// Return the contractor's contracts
		res.status(200).json({
			success: true,
			data: contractorContracts,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve contractor contracts",
			error: error.message,
		});
	}
};

// deleteContract
const deleteContract = async (req, res) => {
	try {
		// fetch contractId from request body
		const { contractId } = req.body;

		// Find the contract
		const contract = await Contract.findById(contractId);
		if (!contract) {
			return res.status(404).json({ message: "Contract not found" });
		}

		// check if the contract is not in Draft or Published status
		if (contract.status !== "Draft" && contract.status !== "Published") {
			return res.status(403).json({
				success: false,
				message:
					"Cannot delete a contract that is not in Draft or Published status",
			});
		}

		//  fetch and delete all the offers submitted for the contract
		const offers = contract.offersSubmitted;
		if (offers.length > 0) {
			for (let i = 0; i < offers.length; i++) {
				await Offer.findByIdAndDelete(offers[i]);
			}
		}

		// Delete the contract
		await Contract.findByIdAndDelete(contractId);

		//   return successfull response
		return res.status(200).json({
			success: true,
			message: "Contract deleted successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong while deleting Contract",
			error: error.message,
		});
	}
};

module.exports = {
	getAllContracts,
	createContract,
	getContractDetails,
	updateContract,
	getContractorContracts,
	deleteContract,
};
