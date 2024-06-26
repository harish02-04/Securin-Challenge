const https = require('https');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Harish@123',
  database: 'cve'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);

  const apiUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

  const fetchData = (url) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', async () => {
        try {
          const cveData = JSON.parse(data);
          const cves = cveData.vulnerabilities;
          let Insertions = 0;
          let Duplicates = 0;

          for (const cve of cves) {
            const { id, sourceIdentifier, published, lastModified, vulnStatus, descriptions, configurations } = cve.cve;
            const { baseSeverity, exploitabilityScore, impactScore } = cve.cve.metrics?.cvssMetricV2?.[0] || { baseSeverity: null, exploitabilityScore: null, impactScore: null };
            const { vectorString, accessVector, accessComplexity, authentication, confidentialityImpact, integrityImpact, availabilityImpact, baseScore } = cve.cve.metrics?.cvssMetricV2?.[0]?.cvssData || { vectorString: null, accessVector: null, accessComplexity: null, authentication: null, confidentialityImpact: null, integrityImpact: null, availabilityImpact: null, baseScore: null };
                      
            const publishedDate = new Date(published);
            const lastModifiedDate = new Date(lastModified);

            const formattedPublished = publishedDate.toISOString().slice(0, 19).replace('T', ' ');
            const formattedLastModified = lastModifiedDate.toISOString().slice(0, 19).replace('T', ' ');


            try {
              const [existingRowsMain] = await connection.promise().execute('SELECT COUNT(*) as count FROM main WHERE cvid = ? AND identifier = ? AND publisher = ? AND lastmod = ? AND status = ?', [id, sourceIdentifier, formattedPublished, formattedLastModified, vulnStatus]);
            
              if (existingRowsMain[0].count === 0) {
                await connection.promise().execute('INSERT INTO main (cvid, identifier, publisher, lastmod, status) VALUES (?, ?, ?, ?, ?)', [id, sourceIdentifier, formattedPublished, formattedLastModified, vulnStatus]);
                Insertions+=1;
              }
              else{
                Duplicates+=1;
              } 
              const [existingRowsExpo] = await connection.promise().execute('SELECT COUNT(*) as count FROM expo WHERE cvid = ?', [id]);
              
              if (existingRowsExpo[0].count === 0) {
                await connection.promise().execute('INSERT INTO expo (cvid, descrip, score, severe, vecst, acvec, accom, auth, cimp, Iimp, aimp, escore, iscore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [id, descriptions[0]?.value || null, baseScore, baseSeverity, vectorString, accessVector, accessComplexity, authentication, confidentialityImpact, integrityImpact, availabilityImpact, exploitabilityScore, impactScore]);
                Insertions+=1;
              } 
              else{
                Duplicates+=1;
              }
              if (configurations && configurations.length > 0 && configurations[0].nodes && configurations[0].nodes.length > 0) {
                const { cpeMatch } = configurations[0].nodes[0];
                for (const match of cpeMatch) {
                  const { vulnerable, criteria, matchCriteriaId } = match;
                  try {
                  
                    const [existingRows] = await connection.promise().execute('SELECT COUNT(*) as count FROM config WHERE cvid = ? AND vulnerable = ? AND criteria = ? AND matchCriteriaId = ?', [id, vulnerable, criteria, matchCriteriaId]);

                    if (existingRows[0].count === 0) {
                  
                      await connection.promise().execute('INSERT INTO config (cvid, vulnerable, criteria, matchCriteriaId) VALUES (?, ?, ?, ?)', [id, vulnerable, criteria, matchCriteriaId]);
        
                      Insertions++;
                    } else {
                      Duplicates++;
                    }
                  } catch (error) {
                    console.error('Error inserting or checking configuration:', error);
                  }
                }
              }
            } catch (error) {
              console.error('Error executing SQL query:', error);
            }
          }

    
          if (Insertions > 0 || Duplicates > 0) {
            console.log('Database Updation Successful');
          } else {
            console.log('No Updations');
          }

       
          setTimeout(() => {
            fetchData(apiUrl);
          }, 24 * 60 * 60 * 1000); 
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching data:', error);

   
      setTimeout(() => {
        fetchData(apiUrl);
      }, 5 * 60 * 1000); 
    });
  };


  fetchData(apiUrl);
});
