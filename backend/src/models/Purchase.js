const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
userId: {
type: String,
required: true
},
courseId: {
type: String,
required: true
},
paymentId: {
type: String,
required: true
}
}, {
timestamps: true
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
