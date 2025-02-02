import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import { GiBroom } from 'react-icons/gi';
import './FiltradoAgregado.css';

const FiltradoAgregado = ({
  filterOptions,
  filterText,
  filterLabel = 'Filtrar por:',
  filterPlaceholder = 'Buscar...',
  addLabel = 'Agregar',
  onFilterApply,
  onAddClick,
  onClearFilter,
  onFilterTextChange,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = (text) => {
    onFilterTextChange(text);
    if (selectedFilter) {
      onFilterApply(selectedFilter, text);
    }
  };

  return (
    <div className="filter-container">
      <div className="filter-container-left">
        <span>{filterLabel}</span>
        <select
          onChange={(e) => setSelectedFilter(e.target.value)}
          value={selectedFilter}
        >
          <option value="" disabled>
            Seleccionar columna
          </option>
          {filterOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="filter-input-container">
          <input
            type="text"
            placeholder={filterPlaceholder}
            value={filterText}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-container-center">
        <span className="add-label">{addLabel}:</span>
        <button className="add-icon" onClick={onAddClick}>
          <FaPlus />
        </button>
      </div>

      <div className="filter-container-right">
        <button className="clear-icon" onClick={onClearFilter} title="Limpiar Filtro">
          <GiBroom className="clear-broom-icon" />
          <span className="clear-label">Limpiar Filtro</span>
        </button>
      </div>
    </div>
  );
};

FiltradoAgregado.propTypes = {
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  filterText: PropTypes.string.isRequired,
  filterLabel: PropTypes.string,
  filterPlaceholder: PropTypes.string,
  addLabel: PropTypes.string,
  onFilterApply: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onFilterTextChange: PropTypes.func.isRequired,
};

export default FiltradoAgregado;
