const { Schema, model, mongoose } = require("mongoose");

const offerSchema = new Schema(
	{
		contract: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
            required: true,
		},
		farmer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
            required: true,
		},
		offerPrice: {
			type: Number,
			required: true,
		},
		offerDescription: {
			type: String,
		},
		offerStatus: {
			type: String,
			default: "Pending",
			enum: ["Pending", "Accepted", "Rejected"],
		},
        offerResponseReason: {
            type: String
        }
	},
	{ timestamps: true }
);

module.exports = model("Offer", offerSchema);
