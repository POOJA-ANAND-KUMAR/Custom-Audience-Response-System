import React from "react";

function Status(props) {
  let tableRows = null;
  if (props.latestStat) {
    tableRows = props.latestStat.map(function(client, index) {
      return (
        <tr key={index}>
          <td>{client.origin}</td>
          <td>{client.port}</td>
          <td>{client.name}</td>
          <td>{client.role}</td>
        </tr>
      );
    });
  }
  return (
    <div>
      <h2>Classroom Status</h2>
      <h3>Socket status: {props.sockStatus}</h3>
      <h2>Clients</h2>
      <table>
        <thead>
          <tr>
            <th>IP</th>
            <th>Port</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </div>
  );
}

export default Status;
