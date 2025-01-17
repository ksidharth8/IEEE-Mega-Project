const { Schema, model, mongoose } = require("mongoose");

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		accountType: {
			type: String,
			enum: ["Admin", "Farmer", "Contractor"],
			required: true,
		},
		offers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Offer",
			},
		],
		approved: {	// This field will be used to approve the user by the admin
			type: Boolean,
			default: false,
		},
		additionalDetails: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Profile",
		},
		contracts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Contract",
			},
		],
		token: {
			type: String,
		},
		resetPasswordExpires: {
			type: Date,
		},
		supportingDocuments: {
			type: String,
		},
		contractProgress: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CourseProgress",
		},
	},
	{ timestamps: true }
);

module.exports = model("User", userSchema);
