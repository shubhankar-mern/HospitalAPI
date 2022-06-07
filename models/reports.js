const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema(
  {
    status: {
      type: String,

      enum: [
        'Negative',
        'Travelled-Quarantine',
        'Symptoms-Quarantine',
        'Positive-Admit',
      ],
      default: 'Negative',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patients',
    },
  },
  {
    timestamps: true,
  }
);
const Reports = mongoose.model('Reports', reportSchema);

module.exports = Reports;
