import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'

const CsvGenerator = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    if (!name || !email || !jobTitle) return;

    try {
      await axios.post('http://localhost:5000/employees', {
        name,
        email,
        jobTitle,
      });

      setName('');
      setEmail('');
      setJobTitle('');
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/download', {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'employees.csv';
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container">
        <div>
      <h1>Employee Management</h1>
      <form onSubmit={addEmployee} >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <button type="submit">Add Employee</button>
      </form>
      </div>
      <div className='employees-list' >
        <h1>Employees List</h1>
        <div className='employees'>
        {employees.map((employee, index) => (
          <div key={index} className='employee' >
            <span className='details'>{employee.name}</span>
            <span className='details'>{employee.email}</span>
            <span className='details'>{employee.jobTitle}</span>
          </div>
        ))}
        </div>
        <button onClick={downloadCSV} className='download-btn' >Download CSV</button>
      </div>
    </div>
  );
}

export default CsvGenerator;
