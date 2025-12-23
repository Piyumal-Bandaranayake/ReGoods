const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Look for the pattern where MONGODB_URI and NEXTAUTH_URL are on the same line
  // This supports cases where they are directly adjacent or separated by whitespace
  // but importantly, missing a newline.
  const regex = /(MONGODB_URI=.*?)(\s*NEXTAUTH_URL=.*)/;
  
  if (regex.test(content)) {
    console.log("Found malformed .env content.");
    const newContent = content.replace(regex, "$1\n$2");
    fs.writeFileSync(envPath, newContent);
    console.log("Successfully fixed .env file. Please restart your server.");
  } else {
    console.log("The .env file does not appear to have MONGODB_URI and NEXTAUTH_URL on the same line.");
    console.log("Checking if NEXTAUTH_URL is missing...");
    if (!content.includes("NEXTAUTH_URL")) {
        console.log("NEXTAUTH_URL is missing from .env");
    }
  }
} catch (err) {
  console.error("Error reading or writing .env file:", err);
}
