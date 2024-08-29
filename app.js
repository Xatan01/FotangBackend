const express = require('express');
const multer = require('multer');

const app = express();
const port = 5000;

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Import routes
const routes = require('./routes');

// Use routes
app.use('/api', routes(upload));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;