import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import TaskVar from './taskDetail';

const ProcDef = ({ key_, goBack }) => {
  const [instances, setInstances] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  const fetchInstances = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/cockpit/process-instance?proc_def_key_=${key_}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!response.ok) throw new Error(`Failed to fetch instances for ${key_}`);

      const data = await response.json();
      setInstances(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Error fetching instances for ${key_}:`, err);
      setInstances([]);
    }
  }, [key_]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  const handleNavigate = (instanceId) => {
    setSelectedKey(instanceId);
    setCurrentPage('TaskVar');
  };

  if (currentPage === 'TaskVar' && selectedKey) {
    return <TaskVar key_={selectedKey} goBack={() => setCurrentPage('home')} />;
  }

  return (
    <div>
      <h2>Process Definition: {key_}</h2>
      <p>Active Instances: {instances.length}</p>
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Instance ID</th>
            <th>Start Time</th>
            <th>Business Key</th>
            <th>Version</th>
          </tr>
        </thead>
        <tbody>
          {instances.length > 0 ? (
            instances.map((instance, index) => {
              const startTime = new Date(instance.start_time_).toLocaleString('id-ID', { hour12: false });
              return (
                <tr key={instance.id_}>
                  <td>{index + 1}</td>
                  <td>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleNavigate(instance.id_)}
                    >
                      {instance.id_}
                    </button>
                  </td>
                  <td>{startTime}</td>
                  <td>{instance.business_key_ || '-'}</td>
                  <td>{instance.version_ || '-'}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>No active instances</td>
            </tr>
          )}
        </tbody>
      </table>

      <button type="button" onClick={goBack} style={{ marginTop: '10px' }}>
        Back
      </button>
    </div>
  );
};

ProcDef.propTypes = {
  key_: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default ProcDef;
