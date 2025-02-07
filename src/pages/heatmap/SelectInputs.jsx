/* eslint-disable */
import React from 'react';

const SelectInputs = ({ 
  options, 
  versions, 
  selectedFileName, 
  selectedVersion, 
  selectedType, 
  typeOptions, 
  handleFileNameChange, 
  handleVersionChange, 
  handleTypeChange 
}) => (
  <div className="select-inputs">
    <div>
      <label htmlFor="filename-select">Pilih Diagram:</label>
      <select
        id="filename-select"
        value={selectedFileName}
        onChange={handleFileNameChange}
      >
        <option value="" disabled>
          -- Pilih Diagram --
        </option>
        {options.map((option) => (  
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>

    {selectedFileName && versions.length > 0 && (
      <div>
        <label htmlFor="version-select">Pilih Versi:</label>
        <select
          id="version-select"
          value={selectedVersion}
          onChange={handleVersionChange}
        >
          <option value="" disabled>
            -- Pilih Versi --
          </option>
          {versions.map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>
    )}

    {selectedFileName && (
      <div>
        <label htmlFor="type-select">Pilih Type:</label>
        <select
          id="type-select"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value="" disabled>
            -- Pilih Type --
          </option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
);

export default SelectInputs;
