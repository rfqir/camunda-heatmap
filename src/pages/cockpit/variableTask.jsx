/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const VarTask = ({ instanceId}) => {
  const [instances, setInstances] = useState([]);

  const fetchInstances = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/cockpit/task-instance/variable?instance_id=${instanceId}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!response.ok) throw new Error(`Failed to fetch instances for ${instanceId}`);

      const data = await response.json();
      setInstances(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Error fetching instances for ${instanceId}:`, err);
      setInstances([]);
    }
  }, [instanceId]);

  useEffect(() => {
    if (instanceId) {
      fetchInstances();
    }
  }, [instanceId, fetchInstances]);

  return (
    <div className="heatmap">
          <div className="editor-container">
            <h2>Variables</h2>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Variable Name</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {instances.length > 0 ? (
                  instances.map((instance, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{instance.name_ || '-'}</td>
                      <td>{instance.type_ || '-'}</td>
                      <td>{instance.value || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No active instances</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
    </div>
  );
};

VarTask.propTypes = {
  instanceId: PropTypes.string.isRequired,
};

export default VarTask;
