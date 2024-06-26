import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const List = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/cve/data?page=${page}&pageSize=${pageSize}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedData = data.results.map(row => ({
          ...row,
          published: formatDate(row.publisher),
          lastmod: formatDate(row.lastmod)
        }));
        setData(formattedData);
        setTotalPages(data.totalPages);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [page, pageSize]);

  const formatDate = dateStr => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handlePageSizeChange = event => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  return (
    <div>
        <br/>
      <center><h1>CVE LIST</h1></center>
      <br/>
      <br/>
      <div style={{marginLeft:85,fontSize:20}}>
        <label><b>Total Records: </b>{totalPages*pageSize}</label>
        <label htmlFor="pageSizeSelect" style={{marginLeft:1300}}>Results per page </label>
        <select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} style={{marginLeft:10}}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
      <br/>
      <center><table className="table" style={{ borderCollapse: 'collapse', width: '90%' }}>
  <thead>
    <tr style={{ borderBottom: '2px solid black' }}>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',paddingBottom:40,fontSize:20,backgroundColor:'#b9bdba'}}>CVE ID</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',paddingBottom:40,fontSize:20,backgroundColor:'#b9bdba' }}>IDENTIFIER</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',paddingBottom:40,fontSize:20,backgroundColor:'#b9bdba' }}>PUBLISHED DATE</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',paddingBottom:40 ,fontSize:20,backgroundColor:'#b9bdba'}}>LAST MODIFIED DATE</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',paddingBottom:40,fontSize:20,backgroundColor:'#b9bdba' }}>STATUS</th>
      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',paddingBottom:40,fontSize:20,backgroundColor:'#b9bdba' }}>DETAILS</th>
    </tr>
  </thead>
  <tbody>
    {data.map(row => (
      <tr key={row.id} style={{ borderBottom: '1px solid black',fontSize:20 }}>
        <td style={{ border: '1px solid black', padding: '8px' }}>{row.cvid}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{row.identifier}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{row.published}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{row.lastmod}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>{row.status}</td>
        <td style={{ border: '1px solid black', padding: '8px' }}>
          <Link to={`/cves/${row.cvid.toLowerCase()}`}>
            <button style={{ padding: '4px 8px',borderRadius:7 ,border:0,backgroundColor:'white',fontWeight:'bolder'}}><u>View</u></button>
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table></center>

      <div style={{marginLeft:85}}>
        <pre><button style={{marginRight:10,borderRadius:5,backgroundColor:'#b9bdba'}} onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
          {"<"}
        </button>   
                    <b>{`${page} of ${totalPages}`}</b>
        <button style={{marginLeft:10,borderRadius:5,backgroundColor:'#b9bdba'}} onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
          {">"}
        </button></pre>
      </div>
    </div>
  );
};

export default List;
