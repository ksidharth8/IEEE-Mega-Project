// Import Express and create a router
const express = require("express");
const router = express.Router();

// Contract Controllers Import
const {
	getAllContracts,
	createContract,
	getContractDetails,
	updateContract,
	getContractorContracts,
	deleteContract,
} = require("../controllers/Contract");

// Contract Progress Controllers Import
const {
	updateContractProgress,
	// getProgressPercentage,
} = require("../controllers/ContractProgress");

// Importing Middlewares
const {
	auth,
	isFarmer,
	isContractor,
} = require("../middlewares/auth");

// ********************************************************************************************************
// *                                    Contract routes                                                     *
// ********************************************************************************************************

// Only Contractors can create, update, delete a contract & get all contracts of a contractor; add, update & delete a section; add & delete a subsection
// Create a Contract [POST /createContract]
router.post("/createContract", auth, isContractor, createContract);
// Update Contract routes [POST /updateContract]
router.post("/updateContract", auth, isContractor, updateContract);
// Delete a Contract [DELETE /deleteContract]
router.delete("/deleteContract", auth, isContractor, deleteContract);
// Get all Contracts Under a Specific Contractor [GET /getContractorContracts]
router.get(
	"/getContractorContracts",
	auth,
	isContractor,
	getContractorContracts
);

// Get all Registered Contracts [GET /getAllContracts]
router.get("/getAllContracts", getAllContracts);
// Get Details for a Specific Contracts [POST /getContractDetails]
router.get("/getContractDetails", getContractDetails);

// Update Contract Progress(by Farmers only) [POST /updateContractProgress]
router.put("/updateContractProgress", auth, isFarmer, updateContractProgress);

module.exports = router;
