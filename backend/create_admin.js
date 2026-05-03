/**
 * ⚠️ SECURITY WARNING ⚠️
 * This script is for initial setup only. It contains a hardcoded admin password.
 * DO NOT deploy this file to a production server without changing the password,
 * or delete this file entirely after running it once locally.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aryan-jewellery').then(async () => {
  try {
    const email = 'admin@aryanjewellery.com';
    const password = 'AdminPassword123!';
    
    let admin = await User.findOne({ email });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!admin) {
      await User.create({ name: 'Aryan Admin', email, password: hashedPassword, role: 'admin' });
      console.log('Created new admin user.');
    } else {
      admin.password = hashedPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Updated existing admin user.');
    }
    console.log(`\n--- ADMIN CREDENTIALS ---`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}\n`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
