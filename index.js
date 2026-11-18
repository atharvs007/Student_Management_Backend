require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Student = require('./models/studentModel');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, 'index.html')));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

// CREATE Student
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ message: "Student added", data: student });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// READ All Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPDATE Student
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Student updated", data: student });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE Student
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Serve index.html on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server (For Local & Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the Express API (Required for Vercel deployment)
module.exports = app;