import React, { useState, useEffect, useCallback } from 'react';
import { Card, Container } from 'react-bootstrap';
import ProcDef from './ProcessDefinition';

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // Untuk navigasi
  const [selectedKey, setSelectedKey] = useState(null);

  const fetchDefinitionKey = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/cockpit/process-definition`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const result = await response.json();

      if (Array.isArray(result)) {
        const enrichedData = await Promise.all(
          result.map(async (item) => {
            try {
              const countResponse = await fetch(
                `${process.env.REACT_APP_ENDPOINT}/cockpit/process-instance/count?proc_def_key_=${item.key_}`,
                { headers: { 'Content-Type': 'application/json' } }
              );
              if (!countResponse.ok) throw new Error(`Failed to fetch count for ${item.key_}`);

              const countData = await countResponse.json();
              return {
                ...item,
                instanceCount: countData ? countData.amount : 0,
              };
            } catch (err) {
              console.error(`Error fetching instance count for ${item.key_}:`, err);
              return { ...item, instanceCount: 0 };
            }
          })
        );

        setData(enrichedData);
      } else {
        console.error('Unexpected data format:', result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchDefinitionKey();
  }, [fetchDefinitionKey]);

  const handleNavigate = (key) => {
    setSelectedKey(key);
    setCurrentPage('ProcDef');
  };

  if (currentPage === 'ProcDef' && selectedKey) {
    return <ProcDef key_={selectedKey} goBack={() => setCurrentPage('home')} />;
  }

  return (
    <Container>
      <div>
        <Card.Title>Process Definitions</Card.Title>
        <h2>{data.length} process definitions deployed</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Key</th>
              <th>Name</th>
              <th>Active Instance</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.deployment_id_}>
                  <td>{index + 1}</td>
                  <td>
                    <button
                      type="button" // ✅ Menambahkan atribut type untuk menghindari error
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleNavigate(item.key_)}
                    >
                      {item.key_}
                    </button>
                  </td>
                  <td>{item.name_ || '-'}</td>
                  <td>{item.instanceCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

export default App;
