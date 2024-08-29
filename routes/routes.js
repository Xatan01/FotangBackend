const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const { executeQuery, insertUser } = require('./db');

const router = express.Router();

module.exports = (upload) => {
  // Query endpoint
  router.post('/query', async (req, res) => {
    const { query } = req.body;
    
    try {
      const result = await executeQuery(query);
      res.json(result);
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  });

  // Upload endpoint
  router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (let row of results) {
            await insertUser(row.name, row.email);
          }
          res.json({ message: 'File uploaded and data inserted successfully.' });
        } catch (error) {
          console.error('Error inserting data:', error);
          res.status(500).json({ message: 'Error inserting data into the database.' });
        } finally {
          // Delete the temporary file
          fs.unlinkSync(req.file.path);
        }
      });
  });

  return router;
};