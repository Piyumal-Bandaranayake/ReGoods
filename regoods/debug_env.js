require('dotenv').config();
console.log("URI Length:", (process.env.MONGODB_URI || "").length);
console.log("URI Content (Safe):", (process.env.MONGODB_URI || "").substring(0, 20) + "..." + (process.env.MONGODB_URI || "").slice(-20));
console.log("Does it contain NEXTAUTH_URL?", (process.env.MONGODB_URI || "").includes("NEXTAUTH_URL"));
