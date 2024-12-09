import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Tabla.css';

const Tabla = ({ columns, data, onEditClick, onDeleteClick }) => {
  return (
    <table className="table">
      <thead className="header">
        <tr>
          {columns.map((column, index) => (
            <th className="table-cell" key={index}>
              {column.header}
            </th>
          ))}
          <th className="table-cell">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td className="table-cell" key={colIndex}>
                {row[column.accessor]}
              </td>
            ))}
            <td className="table-cell">
              <button className="action-button edit" onClick={() => onEditClick(row)}>
                <FaEdit />
              </button>
              <button className="action-button delete" onClick={() => onDeleteClick(row.id)}>
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Tabla.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default Tabla;