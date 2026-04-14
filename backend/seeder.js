const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Visit = require('./models/Visit');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const doctors = [
  { name: 'Dr. Sarah Smith', specialization: 'Cardiology', email: 'sarah@medcare.com', phone: '1234567890' },
  { name: 'Dr. James Wilson', specialization: 'Neurology', email: 'james@medcare.com', phone: '0987654321' },
  { name: 'Dr. Elena Rodriguez', specialization: 'Pediatrics', email: 'elena@medcare.com', phone: '5556667777' },
];

const patients = [
  { name: 'John Doe', age: 34, gender: 'Male', email: 'john@gmail.com', phone: '1112223333', address: '123 Main St' },
  { name: 'Jane Miller', age: 28, gender: 'Female', email: 'jane@gmail.com', phone: '4445556666', address: '456 Oak Ave' },
];

const importData = async () => {
  try {
    await Visit.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await User.deleteMany();

    const createdDoctors = await Doctor.insertMany(doctors);
    const createdPatients = await Patient.insertMany(patients);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@medcare.com',
      password: 'password123',
    });

    await Visit.create({
      patient: createdPatients[0]._id,
      doctor: createdDoctors[0]._id,
      reason: 'Regular Checkup',
      status: 'Scheduled'
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Visit.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
