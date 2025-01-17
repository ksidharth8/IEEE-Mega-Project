// Import express and create a router
const express = require("express");
const router = express.Router();

// Importing Profile Controllers
const {
	updateProfile,
	deleteAccount,
	getUserDetails,
	updateSupportingDocuments,
	getEnrolledContracts,
	contractorDashboard,
	farmerDashboard,
} = require("../controllers/Profile");

// Importing Middlewares
const { auth, isContractor, isFarmer } = require("../middlewares/auth");

// ********************************************************************************************************
// *                                    Profile routes                                                    *
// ********************************************************************************************************

// Delete User Account [DELETE /deleteProfile]
router.delete("/deleteProfile", auth, deleteAccount);
// Update User Profile [PUT /updateProfile]
router.put("/updateProfile", auth, updateProfile);
// Get User Details [GET /getUserDetails]
router.get("/getUserDetails", auth, getUserDetails);
// Get Enrolled Contracts [GET /getEnrolledContracts]
router.get("/getEnrolledContracts", auth, getEnrolledContracts);
// Update Supporting Documents [PUT /updateSupportingDocuments]
router.put("/updateSupportingDocuments", auth, updateSupportingDocuments);
// Get Contractor Dashboard(by contractors only) [GET /contractorDashboard]
router.get("/contractorDashboard", auth, isContractor, contractorDashboard);
// Get Farmer Dashboard(by farmers only) [GET /farmerDashboard]
router.get("/farmerDashboard", auth, isFarmer, farmerDashboard);

module.exports = router;
