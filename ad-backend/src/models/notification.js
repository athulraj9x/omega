const mongoose = require("mongoose");
const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users",
        maxLength: 100,
    },
    message: { type: String, required: true },
    status: { type: Boolean },
    general : {type : Boolean }
},
    { timestamps: { createDate: "createdAt", updatedDate: "updated_at" } });
module.exports = mongoose.model("Notification", NotificationSchema);
