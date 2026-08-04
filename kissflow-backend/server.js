const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using the environment variable
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kogulvs_db_user:g0eBX7xeHdzQlOcJ@cluster0.zjnzsrw.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Method 1 Connected to Permanent MongoDB Database!"))
  .catch((err) => console.error("Database Connection Error:", err));

// Define the Job Schema
const jobSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Job = mongoose.model('JobMethod1', jobSchema);

// Webhook or Job Creation Endpoint for Method 1
app.post('/api/jobs', async (req, res) => {
  try {
    const incomingData = req.body;
    const newJob = new Job(incomingData);
    await newJob.save();

    console.log("Method 1 saved job permanently to MongoDB!");
    res.status(200).json({ success: true, message: "Job saved successfully!" });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET Endpoint to fetch jobs for the frontend
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Method 1 Server running on port ${PORT}`);
});