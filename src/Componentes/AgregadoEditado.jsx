import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AgregadoEditado.css';

const AgregadoEditado = ({
  title,
  fields,
  isOpen,
  onClose,
  onSave,
  onConfirm,
  confirmationMode = false, // Propiedad para saber si es un modal de confirmación
  confirmationMessage = '', // Mensaje para el modal de confirmación
  className,
}) => {
  const [errors, setErrors] = useState({}); // Estado para los errores de validación

  if (!isOpen) return null;

  // Validar un campo individual
  const validateField = (field, value) => {
    if (field.validate) {
      const error = field.validate(value.trim());
      return error;
    }
    return '';
  };

  // Actualizar errores y valores mientras se escribe
  const handleInputChange = (field, value) => {
    field.onChange(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field.name]: validateField(field, value),
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    const newErrors = {};
    const newRecord = fields.reduce((record, field) => {
      const error = validateField(field, field.value);
      if (error) {
        newErrors[field.name] = error;
      }
      record[field.name] = field.value.trim();
      return record;
    }, {});

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave(newRecord); // Enviar el registro si no hay errores
    }
  };

  return (
    <div className={`modal-overlay ${className || ''}`}>
      <div className="modal-content">
        <h2>{title}</h2>
        {confirmationMode ? (
          // Modal de confirmación
          <div>
            <p>{confirmationMessage}</p>
            <div className="modal-actions">
              <button onClick={onConfirm} className="btn btn-primary">
                Confirmar
              </button>
              <button onClick={onClose} className="btn btn-secondary">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          // Modal de edición o adición
          <form onSubmit={handleSave}>
            {fields.map((field, index) => (
              <div className="form-group" key={index}>
                <label>{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={field.value}
                    className={field.className || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {field.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.multiline ? (
                  // Renderizado del textarea si multiline es true
                  <textarea
                    placeholder={field.placeholder || ''}
                    value={field.value}
                    className={field.className || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    required
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder || ''}
                    value={field.value}
                    className={field.className || ''} // Aplica la clase personalizada si existe
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    required
                  />
                )}
                {errors[field.name] && (
                  <div className="error-message">{errors[field.name]}</div>
                )}
              </div>
            ))}
            <div className="modal-actions">
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

AgregadoEditado.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      value: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
      readOnly: PropTypes.bool,
      type: PropTypes.string,
      multiline: PropTypes.bool, // Nueva propiedad para renderizar textarea
      validate: PropTypes.func, // Función de validación personalizada
      options: PropTypes.arrayOf(PropTypes.string), // Opciones para select
    })
  ),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onConfirm: PropTypes.func, // Función para confirmar eliminación
  confirmationMode: PropTypes.bool, // Modo de confirmación
  confirmationMessage: PropTypes.string, // Mensaje de confirmación
  className: PropTypes.string,
};

export default AgregadoEditado;
