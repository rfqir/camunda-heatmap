import React, { useState } from 'react';

const BPMNTaskViewer = () => {
  const [tasks, setTasks] = useState([]);

  const formatTime = (timeObj) => {
    if (!timeObj) return '';
    return `${String(timeObj.hours).padStart(2, '0')}:${String(timeObj.minutes).padStart(2, '0')}`;
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.elements.bpmnFile.files[0];
    if (!file) {
      console.log('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('bpmnFile', file);

    try {
      const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/scrapping/upload-bpmn`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        const tasksWithConfig = await Promise.all(
          result.data.map(async (task) => {
            try {
              const dataConfigResponse = await fetch(
                `${process.env.REACT_APP_ENDPOINT}/heatmap/task-configuration?processKey=${task.processId}&UserTaskID=${task.UserTaskID}`
              );

              let configData = {};
              if (dataConfigResponse.ok) {
                configData = await dataConfigResponse.json();
              }

              return { ...task, config: configData };
            } catch (error) {
              console.error('Error fetching task configuration:', error);
              return { ...task, config: {} };
            }
          })
        );

        setTasks(tasksWithConfig);
      } else {
        console.log('Failed to process file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = tasks.map(task => ({
        processId: task.processId,
        userTaskId: task.UserTaskID,
        priority: task.config.priority_ || '',
        notificationEnabled: task.config.notification_enabled_,
        reminderMessage: task.config.task_notification_ || '',
        customDueTime: formatTime(task.config.custom_duedate_),
        reminderFormat: 'fixed',
        deadlineReminderTime: formatTime(task.config.time_deadline_reminder_),
        counterDeadline: task.config.counter_deadline_ || '',
        deadlineReminder: task.config.due_date_reminder_ || '',
        taskDelegationMessage: task.config.task_handover_notification_ || ''
      }));

      const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/heatmap/task-monitoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Response:', result);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-center text-blue-600 text-2xl font-bold mb-4">BPMN Task Viewer</h1>
      <form onSubmit={handleFileUpload} className="bg-white p-4 shadow rounded">
        <label className="block font-bold">Upload BPMN File:</label>
        <input type="file" name="bpmnFile" accept=".bpmn" className="mb-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Upload and Process</button>
      </form>

      {tasks.length > 0 && (
        <div className="bg-white p-4 shadow rounded mt-4">
          <h2 className="text-center text-xl font-bold mb-2">Parsed User Tasks</h2>
          <table className="styled-table">
            <thead>
              <tr className="bg-gray-200">
                <th>Process ID</th>
                <th>User Task Name</th>
                <th>User Task ID</th>
                <th>Priority</th>
                <th>Notification Enabled</th>
                <th>Reminder Message</th>
                <th>Custom Due Time</th>
                <th>Reminder Format</th>
                <th>Deadline Reminder Time</th>
                <th>Counter Deadline</th>
                <th>Deadline Reminder</th>
                <th>Task Delegation Message</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={task.UserTaskID || index}>
                  <td>{task.processId || '-'}</td>
                  <td>{task.UserTaskName || '-'}</td>
                  <td>{task.UserTaskID || '-'}</td>
                  <td><input type="text" defaultValue={task.config.priority_ || ''} /></td>
                  <td><input type="checkbox" defaultChecked={task.config.notification_enabled_} /></td>
                  <td><textarea defaultValue={task.config.task_notification_ || ''} /></td>
                  <td><input type="text" defaultValue={formatTime(task.config.custom_duedate_)} /></td>
                  <td>
                    <select defaultValue="fixed">
                      <option value="fixed">Fix Time</option>
                      <option value="countdown">Countdown</option>
                    </select>
                  </td>
                  <td><input type="text" defaultValue={formatTime(task.config.time_deadline_reminder_)} /></td>
                  <td><input type="number" defaultValue={task.config.counter_deadline_ || ''} /></td>
                  <td><textarea defaultValue={task.config.due_date_reminder_ || ''} /></td>
                  <td><textarea defaultValue={task.config.task_handover_notification_ || ''} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit} type="submit" className="mt-4 bg-green-500 text-white p-2 rounded">Submit</button>
        </div>
      )}
    </div>
  );
};

export default BPMNTaskViewer;
