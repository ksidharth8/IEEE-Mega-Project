const { Schema, model, mongoose } = require("mongoose");

const contractSchema = new Schema(
	{
		contractName: {
			type: String,
			required: true,
		},
		contractDescription: {
			type: String,
			required: true,
		},
		contractor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		proposedPrice: {
			type: Number,
			required: true,
		},
		offersSubmitted: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Offer",
			},
		],
		farmerEnrolled: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		status: {	// This field will be used to track the status of the contract
			type: String,
			default: "Draft",
			enum: ["Draft", "Published", "Enrolled", "Ongoing", "Completed"],
		},
	},
	{ timestamps: true }
);

module.exports = model("Contract", contractSchema);
