import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './App.css';

const App = () => {
  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState({ Red: [], Green: [], Blue: [], Yellow: [] });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const ab = event.target.result;
        const wb = XLSX.read(ab, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const membersList = data.slice(1).map(row => row[0]); // Assuming the names are in the first column
        setMembers(membersList);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const divideTeams = () => {
    let teamsCopy = { Red: [], Green: [], Blue: [], Yellow: [] };
    let teamColors = ['Red', 'Green', 'Blue', 'Yellow'];

    // Shuffle the members randomly
    let shuffledMembers = [...members];
    shuffledMembers.sort(() => Math.random() - 0.5);

    // Distribute members into teams
    shuffledMembers.forEach((member, index) => {
      let team = teamColors[index % 4]; // Use modulo to loop through the 4 teams
      teamsCopy[team].push(member);
    });
    setTeams(teamsCopy);
  };


  const downloadExcel = () => {
    // Prepare data for the Excel file
    const data = [];
    const maxTeamSize = Math.max(teams.Red.length, teams.Green.length, teams.Blue.length, teams.Yellow.length);

    // Add the headers for the columns
    data.push(['Red Team', 'Green Team', 'Blue Team', 'Yellow Team']);

    // Add the team members into rows, making sure all teams have equal rows
    for (let i = 0; i < maxTeamSize; i++) {
      data.push([
        teams.Red[i] || '',
        teams.Green[i] || '',
        teams.Blue[i] || '',
        teams.Yellow[i] || ''
      ]);
    }

    // Create a worksheet from the data
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Teams');

    // Download the Excel file
    XLSX.writeFile(wb, 'DividedSpardheyTeams.xlsx');
  };


  return (
    <div className="App">
      <h1>Team Division</h1>
      <div className='headerrow'>
        <input
          className='filetext'
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
        />

        <button onClick={divideTeams} disabled={members.length === 0}>
          Divide Into Teams
        </button>

        <button onClick={downloadExcel} disabled={Object.keys(teams).length === 0}>
          Download Teams as Excel
        </button>
      </div>
      <div className="teams">
        <div>
          <h2>1st</h2>
          <ul>{teams.Red.map((member, index) => <li key={index}>{member}</li>)}</ul>
        </div>
        <div>
          <h2>2nd</h2>
          <ul>{teams.Green.map((member, index) => <li key={index}>{member}</li>)}</ul>
        </div>
        <div>
          <h2>3rd</h2>
          <ul>{teams.Blue.map((member, index) => <li key={index}>{member}</li>)}</ul>
        </div>
        <div>
          <h2>4th</h2>
          <ul>{teams.Yellow.map((member, index) => <li key={index}>{member}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export default App;
