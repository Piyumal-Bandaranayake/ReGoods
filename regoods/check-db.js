
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Value manual parsing for now 
let MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    try {
        const envPath = path.resolve(__dirname, '.env'); // Try .env
        const envFile = fs.readFileSync(envPath, 'utf8');
        const match = envFile.match(/MONGODB_URI=(.*)/);
        if (match) {
            MONGODB_URI = match[1].trim();
            // Remove quotes if present
            if ((MONGODB_URI.startsWith('"') && MONGODB_URI.endsWith('"')) || 
                (MONGODB_URI.startsWith("'") && MONGODB_URI.endsWith("'"))) {
                MONGODB_URI = MONGODB_URI.slice(1, -1);
            }
        }
    } catch (e) {
        console.log("Could not read .env");
    }
}


const ItemSchema = new mongoose.Schema(
  {
    sellerId: mongoose.Schema.Types.ObjectId,
    title: String,
    condition: String,
    location: String,
    delivery: String,
    returnPolicy: String,
  },
  { strict: false } // strict false to see EVERYTHING in the doc
);

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");

  const latestItem = await Item.findOne().sort({ createdAt: -1 });
  const output = JSON.stringify(latestItem, null, 2);
  console.log("Latest Item:", output);
  fs.writeFileSync('item_log.json', output, 'utf8');

  await mongoose.disconnect();
}

check().catch(console.error);
