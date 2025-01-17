const { Schema, model, mongoose } = require("mongoose");

const contractProgressSchema = new Schema(
	{
		contractID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		progressStep: {
			type: String,
			enum: [
				"Land Preparation",
				"Seed Selection",
				"Sowing",
				"Irrigation",
				"Fertilization",
				"Weed Control",
				"Harvesting",
				"Post Harvesting",
				"Delivery",
				"Payment Pending",
				"Payment Received",
			], // This is a list of steps that the user will have to go through while contract is in ongoing state
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = model("ContractProgress", contractProgressSchema);
