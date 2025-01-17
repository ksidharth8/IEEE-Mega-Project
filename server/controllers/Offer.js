const Offer = require("../models/Offer");
const User = require("../models/User");
require("dotenv").config();

// getAllOffersSubmitted
const getAllOffersSubmitted = async (req, res) => {
	try {
		// fetch all offers submitted to the contract
		const contractId = req.params;
		const offers = await Offer.find({ contract: contractId })
			.populate("farmer")
			.exec();

		// return success response
		res.status(200).json({
			success: true,
			data: offers,
			message: "Offers submitted fetched successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong while fetching the offers",
		});
	}
};

// createOffer
const createOffer = async (req, res) => {
	try {
		// fetch userId from the request object
		const userId = req.user.id;

		// fetch data from the request body
		const { contract, offerDescription, offerPrice } = req.body;

		// check if all fields are provided (validate)
		if (!contract || !offerPrice) {
			return res.status(403).json({
				success: false,
				message: "All fields are required",
			});
		}

		// check for farmer (for storing farmer Object ID)
		const farmerDetails = await User.findById(userId, {
			accountType: "Farmer",
		});
		console.log("Farmer Details: ", farmerDetails);
		// ToDo: Check if the id of user and farmer is same

		if (!farmerDetails) {
			return res.status(404).json({
				success: false,
				message: "Farmer Details not found",
			});
		}

		// create entry for offer in the database
		const newOffer = await Offer.create({
			contract: contract,
			offerDescription: offerDescription,
			farmer: farmerDetails._id,
			offerPrice: offerPrice,
		});

		// add the new offer to the user schema of farmer
		await User.findByIdAndUpdate(
			{ _id: farmerDetails._id },
			{ $push: { offers: newOffer._id } },
			{ new: true }
		);

		// return success response
		res.status(200).json({
			success: true,
			message: "Offer created successfully",
			offer: newOffer,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message:
				("Something went wrong while creating the offer", error.message),
		});
	}
};

// updateOffer
const updateOffer = async (req, res) => {
	try {
		// fetch offerId from the request body
		const { offerId, updates } = req.body;

		// fetch offer details
		const offer = await Offer.findById(offerId);

		// validation
		if (!offer) {
			return res.status(404).json({ error: "Offer not found" });
		}

		// Update only the fields that are present in the request body
		for (const key in updates) {
			if (updates.hasOwnProperty(key)) {
				offer[key] = updates[key];
			}
		}

		// save the updated offer
		await offer.save();

		// fetch the updated offer details
		const updatedOffer = await Offer.findOne({
			_id: offerId,
		})
			.populate({ path: "contract" })
			.exec();

		// return success response
		res.json({
			success: true,
			message: "Offer updated successfully",
			data: updatedOffer,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong while updating the offer",
			error: error.message,
		});
	}
};

// getAllFarmerOffers
const getAllFarmerOffers = async (req, res) => {
	try {
		// Get the farmer ID from the authenticated user or request body
		const farmerId = req.user.id;

		// Find all offers belonging to the farmer
		const farmerOffers = await Offer.find({
			farmer: farmerId,
		})
			.sort({ createdAt: -1 })
			.populate("contract")
			.exec();

		// Return the farmer's offers
		res.status(200).json({
			success: true,
			data: farmerOffers,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Failed to retrieve farmer offers",
			error: error.message,
		});
	}
};

// deleteOffer
const deleteOffer = async (req, res) => {
	try {
		// fetch offerId from request body
		const { offerId } = req.body;

		// Find the offer
		const offer = await Offer.findById(offerId);
		if (!offer) {
			return res.status(404).json({ message: "Offer not found" });
		}

		// check if the offer is not in Accepted status
		if (offer.status !== "Accepted") {
			return res.status(403).json({
				success: false,
				message: "Cannot delete a offer that is in Accepted status",
			});
		}

		// Delete the offer
		await Offer.findByIdAndDelete(offerId);

		//   return successfull response
		return res.status(200).json({
			success: true,
			message: "Offer deleted successfully",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong while deleting Offer",
			error: error.message,
		});
	}
};

module.exports = {
	getAllOffersSubmitted,
	createOffer,
	updateOffer,
	getAllFarmerOffers,
	deleteOffer,
};
