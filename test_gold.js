const mongoose = require('mongoose');
const User = require('./backend/src/models/User');

async function test() {
  await mongoose.connect("mongodb://127.0.0.1:27017/aryan-jewellery");
  const adminUser = await User.findOne({ role: 'admin' });
  
  if (!adminUser) {
    console.log("No admin user found");
    process.exit(1);
  }
  
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

  try {
    const res = await fetch('http://localhost:5000/api/settings/gold-price', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ goldPricePerGram: 7000 })
    });
    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("DATA:", data);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
  process.exit(0);
}

test();
