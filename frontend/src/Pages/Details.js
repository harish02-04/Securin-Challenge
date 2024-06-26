import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Details = () => {
  const { id } = useParams(); 
  const [data, setData] = useState([]);
  const [con, setCon] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/cve/data/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        setData(responseData[0]);

   
        setCon(responseData.map(row => ({
            cret: row.criteria,
            match: row.matchCriteriaId,
            vul: row.vulnerable === '1' ? 'Yes' : 'No' 
          })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  console.log("con",con);
  console.log("uni",data);

  return (
    <div style={{padding:70}}>
      <h1>{data.cvid}</h1>
      <br/>
      <h4>Description:</h4>
      <p style={{fontSize:20}}>{data.descrip}</p>
      <br/>
      <h4>CVSS V2 Metrics:</h4>
      <pre style={{fontSize:20}}><b>Severity:</b> {data.severe}     <b>Score:</b> {data.score}</pre>
      <pre style={{fontSize:20}}><b>Vector String:</b> {data.vecst}</pre>
      <table className="table" style={{ border: '1px solid black' }}>
    <tr>
        <th style={{ border: '1px solid black',padding:10 ,fontSize:20}}>Access Vector</th>
        <th style={{ border: '1px solid black',padding:10,fontSize:20 }}>Access Complexity</th>
        <th style={{ border: '1px solid black',padding:10,fontSize:20 }}>Authentication</th>
        <th style={{ border: '1px solid black' ,padding:10,fontSize:20}}>Confidentiality Impact</th>
        <th style={{ border: '1px solid black' ,padding:10,fontSize:20}}>Integrity Impact</th>
        <th style={{ border: '1px solid black',padding:10 ,fontSize:20}}>Availability Impact</th>
    </tr>
    <tr>
        <td style={{ border: '1px solid black',padding:10 ,fontSize:20}}>{data.acvec}</td>
        <td style={{ border: '1px solid black',padding:10,fontSize:20 }}>{data.accom}</td>
        <td style={{ border: '1px solid black',padding:10,fontSize:20 }}>{data.auth}</td>
        <td style={{ border: '1px solid black',padding:10,fontSize:20 }}>{data.cimp}</td>
        <td style={{ border: '1px solid black',padding:10,fontSize:20 }}>{data.Iimp}</td>
        <td style={{ border: '1px solid black',padding:10,fontSize:20 }}>{data.aimp}</td>
    </tr>
</table>


      <br/>
      <h4>Scores:</h4>
      <pre style={{fontSize:20}}><b>Exploitability Score:</b> {data.escore}</pre>
      <pre style={{fontSize:20}}><b>Impact Score:</b> {data.iscore}</pre>
      <br/>
      <h4>CPE:</h4>
      <table style={{ border: '1px solid black' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid black',padding:10 ,fontSize:20}}>Criteria</th>
      <th style={{ border: '1px solid black',padding:10 ,fontSize:20}}>Match Criteria ID</th>
      <th style={{ border: '1px solid black',padding:10 ,fontSize:20}}>Vulnerable</th>
    </tr>
  </thead>
  <tbody>
    {con.map((row, index) => (
      <tr key={index} style={{ border: '1px solid black' }}>
        <td style={{ border: '1px solid black',padding:10 ,fontSize:20}}>{row.cret}</td>
        <td style={{ border: '1px solid black',padding:10 ,fontSize:20}}>{row.match}</td>
        <td style={{ border: '1px solid black',padding:10,fontSize:20 }}>{row.vul}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Details;
