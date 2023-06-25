import React, { useState } from 'react';
import axios from 'axios';
import './TaskCreator.css';

const TaskCreator = () => {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [user, setUser] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleUserChange = (e) => {
    setUser(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const loginUrl = 'https://stage.api.sloovi.com/login?product=outreach';
    const loginData = {
      email: 'smithwills1989@gmail.com',
      password: '12345678',
    };

    const loginResponse = await axios.post(loginUrl, loginData);
    const { access_token, company_id } = loginResponse.data;

    const teamUrl = `https://stage.api.sloovi.com/team?product=outreach&company_id=${company_id}`;
    const teamResponse = await axios.get(teamUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    const taskUrl = `https://stage.api.sloovi.com/task/lead_65b171d46f3945549e3baa997e3fc4c2?company_id=${company_id}`;
    const taskData = {
      assigned_user: teamResponse.data[0].id,
      task_date: date,
      task_time: time,
      is_completed: 0,
      time_zone: new Date().getTimezoneOffset() * 60, // Current timezone in seconds
      task_msg: task,
    };

    const addTaskResponse = await axios.post(taskUrl, taskData, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    setTask('');
    setDate('');
    setTime('');
    setUser('');
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="task-creator">
      <div className="task-heading">
        <h2>TASKS</h2>
        <button className="add-task-button" onClick={toggleForm}>
          +
        </button>
      </div>
      {showForm && (
        <form className="task-form" onSubmit={handleFormSubmit}>
          <label>
            Task:
            <input type="text" value={task} onChange={handleInputChange} required />
          </label>
          <label>
            Date:
            <input type="date" value={date} onChange={handleDateChange} required />
          </label>
          <label>
            Time:
            <input type="time" value={time} onChange={handleTimeChange} required />
          </label>
          <label>
            Assign user:
            <select value={user} onChange={handleUserChange} required>
              <option value="">Select User</option>
              <option value="Plan User">Plan User</option>
              <option value="Prem Kumar">Prem Kumar</option>
            </select>
          </label>
          <div>
            <button type="submit">Save</button>
            <button type="button" onClick={toggleForm}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskCreator;
