
const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/burg-tent', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const recipeSchema = new mongoose.Schema({
    name: {type: String, require: true},
    description: {type: String, require: true},
    imagePath: {type: String, require: true},
    ingredients: [{
        name: {type: String},
        amount: {type: Number}
    }],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true}
});

module.exports = mongoose.model('Recipe', recipeSchema);