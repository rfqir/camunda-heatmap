/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef } from 'react';
  
const App = () => {
  const [key_, setKey] = useState('');
  const [instances, setInstances] = useState([]);
  const [taskCount, setTaskCount] = useState([]);
  const [procDefKeys, setProcDefKeys] = useState([]);
  const canvasRef = useRef(null);
  const [percentages, setPercentages] = useState({});

  useEffect(() => {
    const fetchProcDefKeys = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/cockpit/process-definition`);
        if (!response.ok) throw new Error('Failed to fetch process definitions');
        const data = await response.json();
        setProcDefKeys(Array.isArray(data) ? data.map(def => def.key_) : []);
      } catch (err) {
        console.error('Error fetching process definitions:', err);
        setProcDefKeys([]);
      }
    };
    fetchProcDefKeys();
  }, []);

  const fetchInstances = useCallback(async () => {
    if (!key_) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/cockpit/process-instance/count/group-state?proc_def_key_=${key_}`,
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
  const fetchTaskCount = useCallback(async () => {
    if (!key_) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/cockpit/task/dashboard-count?proc_def_key_=${key_}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (!response.ok) throw new Error(`Failed to fetch instances for ${key_}`);
      const data = await response.json();
      setTaskCount(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Error fetching instances for ${key_}:`, err);
      setTaskCount([]);
    }
  }, [key_]);
  const TaskChart = ({ taskCount }) => {
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const labels = taskCount.map(task => task.assignee_);
      const achieved = taskCount.map(task => task.acieve);
      const overdue = taskCount.map(task => task.overdue);
      const inProgress = taskCount.map(task => task.inprogress);
      
      const barWidth = 40;
      const gap = 20;
      const baseX = 50;
      const baseY = canvas.height - 30;
      const maxHeight = Math.max(...achieved, ...overdue, ...inProgress, 1);
      const scale = (canvas.height - 60) / maxHeight;
      
      labels.forEach((label, index) => {
        const x = baseX + index * (barWidth * 3 + gap);
        
        // Draw achieved bar
        ctx.fillStyle = "green";
        ctx.fillRect(x, baseY - achieved[index] * scale, barWidth, achieved[index] * scale);
        
        // Draw overdue bar
        ctx.fillStyle = "red";
        ctx.fillRect(x + barWidth, baseY - overdue[index] * scale, barWidth, overdue[index] * scale);
        
        // Draw in-progress bar
        ctx.fillStyle = "blue";
        ctx.fillRect(x + barWidth * 2, baseY - inProgress[index] * scale, barWidth, inProgress[index] * scale);
        
        // Draw labels
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(label, x + barWidth, baseY + 15);
      });
    }, [taskCount]);
  
    return <canvas ref={canvasRef} width={600} height={400} className="border" />;
  };
  useEffect(() => {
    fetchInstances();
    fetchTaskCount();
  }, [fetchInstances,fetchTaskCount]);
  const getBoxClass = (state) => {
    switch (state) {
      case 'ACTIVE':
        return 'box box-active';
      case 'SUSPENDED':
        return 'box box-suspended';
      case 'COMPLETED':
        return 'box box-completed';
      case 'EXTERNALLY_TERMINATED':
        return 'box box-terminated';
      default:
        return 'box box-default';
    }
  };
  const totalAmount = instances.reduce(
    (total, instance) => total + parseInt(instance.amount, 10),
    0
  );

  const drawPieChart = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || totalAmount === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const states = ['ACTIVE', 'SUSPENDED', 'COMPLETED', 'EXTERNALLY_TERMINATED'];
    const colors = ['#ffc000', '#e6e5e6', '#90d14f', '#f70400'];
    const amounts = states.map((state) => {
      const totalStateAmount = instances
        .filter(instance => instance.state === state)
        .reduce((sum, instance) => sum + parseInt(instance.amount, 10), 0);
      return totalAmount > 0 ? (totalStateAmount / totalAmount) * 100 : 0;
    });

    setPercentages(states.reduce((acc, state, index) => {
      acc[state] = amounts[index].toFixed(1);
      return acc;
    }, {}));

    let startAngle = 0;
    amounts.forEach((percentage, index) => {
      const sliceAngle = (percentage / 100) * 2 * Math.PI;
      ctx.fillStyle = colors[index];
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 100, startAngle, startAngle + sliceAngle);
      ctx.lineTo(canvas.width / 2, canvas.height / 2);
      ctx.fill();
      startAngle += sliceAngle;
    });
  };

  useEffect(() => {
    drawPieChart();
  }, [instances, totalAmount]);

  return (
    <div className="p-4 flex">
      <div className="w-2/3">
        <h1 className="bg-red-500">Dashboards</h1>
        <select value={key_} onChange={e => setKey(e.target.value)} className="p-2 border rounded">
          <option value="">Select a key</option>
          {procDefKeys.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">State</h2>
          {instances.length > 0 ? (
            <div className="app-container">
              {instances.map(instance => (
                <div
                  key={`${instance.state}-${instance.amount}`}
                  className={getBoxClass(instance.state)}
                >
                  <p className="text">{instance.state}</p>
                  <p className="amount">{instance.amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No instances found.</p>
          )}
        </div>
      </div>
<div className="p-4 flex">
      <div className="w-2/3">
        <h1 className="bg-red-500">Dashboards</h1>
        <TaskChart taskCount={taskCount} />
      </div>
    </div>
      <div className="w-1/3 p-4 border-2 border-gray-500 rounded-lg shadow-lg bg-white">
        <div className="card-header">
          <h2 className="card-title">State Distribution (as Percentage)</h2>
        </div>
        <div className="card">
          <div className="pie-chart-container">
            <canvas ref={canvasRef} width="300" height="300" />
          </div>
          <div className="mt-4">
            {['ACTIVE', 'SUSPENDED', 'COMPLETED', 'EXTERNALLY_TERMINATED'].map((state, index) => (
              <div key={state} className="flex items-center justify-between p-2 border-b">
                <span className="font-medium" style={{ color: ['#ffc000', '#bbbbbb', '#90d14f', '#f70400'][index] }}>{state}</span>
                <span>. {percentages[state] || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
