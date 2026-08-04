const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Path to jobs.json inside the kissflow-backend folder
const jobsFilePath = path.join(__dirname, 'jobs.json');

// 1. Load saved jobs from 'jobs.json'
let jobListings = fs.existsSync(jobsFilePath)
  ? JSON.parse(fs.readFileSync(jobsFilePath, 'utf8'))
  : [];

// 2. Webhook Endpoint (Receives webhook data from Kissflow)
app.post('/api/webhooks/kissflow', (req, res) => {
  const incomingData = req.body;

  // Add new item to array
  jobListings.push(incomingData);

  // Save array into kissflow-backend/jobs.json
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobListings, null, 2));

  console.log("✅ Saved to kissflow-backend/jobs.json!");
  res.status(200).json({ success: true });
});

// 3. GET Endpoint for your Website (Serves jobs to frontend)
app.get('/api/jobs', (req, res) => {
  res.status(200).json({
    success: true,
    data: jobListings
  });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});