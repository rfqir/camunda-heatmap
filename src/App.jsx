/* eslint-disable */
import React, { Component } from 'react';
import EditorBasic from './containers';

class App extends Component {
  state = {
    diagramXML: null,
    heatmapdata: null,
    options: [], // Menyimpan opsi untuk dropdown diagram
    selectedFileName: '', // Menyimpan filename yang dipilih
    typeOptions: ['duration', 'duedate'], // Opsi untuk type
    selectedType: '', // Menyimpan type yang dipilih
  };

  componentDidMount() {
    this.fetchOptions();

    // Mendapatkan query parameters dari URL
    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('filename');
    const type = params.get('type');

    if (fileName) {
      this.setState({ selectedFileName: fileName });
    }

    if (type) {
      this.setState({ selectedType: type });
    }
  }

  fetchOptions = () => {
    fetch('http://localhost:400/rest-api/camunda/get-list')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch options: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Ambil ID sebelum `:` pertama dan hilangkan duplikasi
        const uniqueOptions = [
          ...new Set(data.map((item) => item.id.split(':')[0])),
        ];
        this.setState({ options: uniqueOptions });
      })
      .catch((error) => console.error('Error fetching options:', error));
  };

  fetchData = (fileName, type) => {
    // Mengambil diagramXML dari API
    fetch(`http://localhost:5000/api/bpmn/${fileName}`)
      .then((response) => response.text()) // Menganggap bahwa diagramXML adalah teks (XML)
      .then((data) => this.setState({ diagramXML: data }))
      .catch((error) => console.error('Error fetching diagramXML:', error));

    // Mengambil heatmapdata dari API
    fetch(`http://localhost:5000/api/diagram/mapping?filename=${fileName}&type=${type}`)
      .then((response) => response.json()) // Menganggap bahwa heatmapdata adalah JSON
      .then((data) => this.setState({ heatmapdata: data }))
      .catch((error) => console.error('Error fetching heatmapdata:', error));
  };

  handleFileNameChange = (event) => {
    const selectedFileName = event.target.value;
    this.setState({ selectedFileName, diagramXML: null, heatmapdata: null });
  };

  handleTypeChange = (event) => {
    const selectedType = event.target.value;
    const { selectedFileName } = this.state;

    this.setState({ selectedType, diagramXML: null, heatmapdata: null }, () => {
      if (selectedFileName && selectedType) {
        this.fetchData(selectedFileName, selectedType);
      }
    });
  };

  render() {
    const {
      diagramXML,
      heatmapdata,
      options,
      selectedFileName,
      typeOptions,
      selectedType,
    } = this.state;
  
    return (
      <div style={{ height: '100%', overflow: 'auto' }}>
        <div>
          <label htmlFor="filename-select">Pilih Diagram:</label>
          <select
            id="filename-select"
            value={selectedFileName}
            onChange={this.handleFileNameChange}
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
  
        {selectedFileName && (
          <div>
            <label htmlFor="type-select">Pilih Type:</label>
            <select
              id="type-select"
              value={selectedType}
              onChange={this.handleTypeChange}
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
  
        {diagramXML && heatmapdata ? (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <EditorBasic heatmapdata={heatmapdata} diagramXML={diagramXML} />
            
            {/* Render the heatmap data table */}
            <table
  border="1"
  style={{
    marginTop: '20px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '60%', // Adjust the width as needed
  }}
>
  <thead>
    <tr>
      <th>Task Name</th>
      <th>Percentage</th>
    </tr>
  </thead>
  <tbody>
    {heatmapdata.map((data, index) => (
      <tr key={index}>
        <td>{data.nameTask || 'No Task Name'}</td>
        <td>{parseInt(data.runCount)}%</td>
      </tr>
    ))}
  </tbody>
</table>

          </div>
        ) : (
          <div>
            {selectedFileName && selectedType
              ? 'Loading...'
              : 'Silakan pilih diagram dan type untuk memulai.'}
          </div>
        )}
      </div>
    );
  }
  
}

export default App;
