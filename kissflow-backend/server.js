const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const jobsFilePath = path.join(__dirname, 'jobs.json');

// Helper function to safely read the file fresh every time
function getJobs() {
  if (!fs.existsSync(jobsFilePath)) return [];
  try {
    const data = fs.readFileSync(jobsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// 1. Webhook Endpoint
app.post('/api/webhooks/kissflow', (req, res) => {
  const incomingData = req.body;

  // Read current jobs directly from file
  let jobListings = getJobs();

  // Add new item
  jobListings.push(incomingData);

  // Save array into jobs.json
  fs.writeFileSync(jobsFilePath, JSON.stringify(jobListings, null, 2));

  console.log("✅ Saved to kissflow-backend/jobs.json!");
  res.status(200).json({ success: true });
});

// 2. GET Endpoint for your Website (Reads fresh from file)
app.get('/api/jobs', (req, res) => {
  const jobListings = getJobs();
  res.status(200).json({
    success: true,
    data: jobListings
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});