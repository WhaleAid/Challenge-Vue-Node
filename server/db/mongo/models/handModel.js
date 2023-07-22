const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let handSchema = new Schema({
    player: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }],
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
    turn: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
}
)

module.exports = mongoose.model('Hand', handSchema);