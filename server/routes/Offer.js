// Import Express and create a router
const express = require("express");
const router = express.Router();

// Offer Controllers Import
const {
	getAllOffersSubmitted,
	createOffer,
	updateOffer,
	getAllFarmerOffers,
	deleteOffer,
} = require("../controllers/Offer");

// Importing Middlewares
const { auth, isFarmer } = require("../middlewares/auth");

// ********************************************************************************************************
// *                                    Offer routes                                                     *
// ********************************************************************************************************

// Only Farmers can create, update, delete a offer & get all offers of a Farmer; add, update & delete a section; add & delete a subsection
// Create a Offer [POST /createOffer]
router.post("/createOffer", auth, isFarmer, createOffer);
// Update Offer routes [POST /updateOffer]
router.post("/updateOffer", auth, isFarmer, updateOffer);
// Delete a Offer [DELETE /deleteOffer]
router.delete("/deleteOffer", auth, isFarmer, deleteOffer);
// Get all Offers Under a Specific Farmer [GET /getAllFarmerOffers]
router.get("/getAllFarmerOffers", auth, isFarmer, getAllFarmerOffers);

// Get all offers submitted to a Contract [GET /getAllOffersSubmitted]
router.get("/getAllOffersSubmitted", getAllOffersSubmitted);

module.exports = router;
