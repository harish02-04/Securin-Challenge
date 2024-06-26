const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harish@123',
  database: 'cve'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/cve/data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
  
    const offset = (page - 1) * pageSize;
  
    const query = `SROM cve.main ORDER BY publisher desc LIMIT ?, ? `;
    connection.query(query, [offset, pageSize], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      connection.query('SELECT COUNT(*) AS totalCount FROM cve.main', (countError, countResults) => {
        if (countError) {
          console.error('Error fetching total count:', countError);
          return res.status(500).json({ error: 'Internal server error' });
        }
        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / pageSize);
        res.json({ results, totalPages });
      });


      
    });
  });
  
  app.get('/cve/data/:cvid', (req, res) => {
    const { cvid } = req.params;
    const query = `
      SELECT e.*, c.vulnerable, c.criteria, c.matchCriteriaId
      FROM expo AS e
      JOIN config AS c ON e.cvid = c.cvid
      WHERE e.cvid = ?
    `;
    connection.query(query, [cvid], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
