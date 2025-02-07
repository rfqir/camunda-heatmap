import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import VarTask from './variableTask';

const TaskVar = ({ key_, goBack }) => {
  const [instances, setInstances] = useState([]);

  const fetchInstances = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/cockpit/task-instance?instance_id=${key_}`,
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

  return (
    <div>
      <h2>Process Instance: {key_}</h2>
      <p>Active Instances: {instances.length}</p>
      <button type="button" onClick={goBack} style={{ marginTop: '10px' }}>
        Back
      </button>
      <h2>User Task</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Task Name</th>
            <th>Assignee</th>
            <th>Owner</th>
            <th>Created At</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {instances.length > 0 ? (
            instances.map((instance, index) => (
              <tr key={instance.id_}>
                <td>{index + 1}</td>
                <td>{instance.name_ || '-'}</td>
                <td>{instance.assignee_ || '-'}</td>
                <td>{instance.owner_ || '-'}</td>
                <td>{new Date(instance.create_time_).toLocaleString('id-ID', { hour12: false })}</td>
                <td>{instance.due_date_ ? new Date(instance.due_date_).toLocaleString('id-ID', { hour12: false }) : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No active instances</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="test">
        <VarTask instanceId={key_} />
      </div>
    </div>
  );
};

TaskVar.propTypes = {
  key_: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
};

export default TaskVar;
