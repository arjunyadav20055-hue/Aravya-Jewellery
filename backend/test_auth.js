const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({ role: 'admin' });
  console.log("Admins:", users.map(u => ({ email: u.email, role: u.role })));
  process.exit(0);
}
test();
