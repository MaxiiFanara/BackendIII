import mongoose from 'mongoose';

const petCollection = 'pets';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specie: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    default: null
  }
}, {
  timestamps: true
});

export const petModel = mongoose.model(petCollection, petSchema);