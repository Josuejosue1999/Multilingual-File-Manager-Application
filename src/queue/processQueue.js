const uploadQueue = require('./uploadQueue'); // Import uploadQueue.js
const fs = require('fs');
const path = require('path');

// Queue processor for file uploads
uploadQueue.process(async (job) => {
  const file = job.data.file;
  console.log(`Processing file upload: ${file}`);
  
  // Simulate file upload logic
  const filePath = path.join(__dirname, '../uploads', file.filename);
  fs.writeFileSync(filePath, file.data);  // This is just an example, adjust according to your needs
  console.log(`File uploaded: ${file.filename}`);
});
