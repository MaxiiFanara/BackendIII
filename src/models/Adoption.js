import mongoose from 'mongoose';

const adoptionCollection = 'adoptions';

const adoptionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pets',
    required: true
  }
}, {
  timestamps: true
});

export const adoptionModel = mongoose.model(adoptionCollection, adoptionSchema);
