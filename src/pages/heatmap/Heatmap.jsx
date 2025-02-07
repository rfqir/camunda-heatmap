/* eslint-disable */
import React, { Component } from 'react';
import SelectInputs from './SelectInputs';
import HeatmapDisplay from './HeatmapDisplay';

class App extends Component {
  state = {
    diagramXML: null,
    heatmapdata: null,
    options: [],
    versions: [],
    selectedFileName: '',
    selectedVersion: '',
    typeOptions: ['duration', 'duedate'],
    selectedType: '',
    currentSubProcess: null,
  };

  componentDidMount() {
    this.fetchOptions();

    const params = new URLSearchParams(window.location.search);
    const fileName = params.get('filename');
    const type = params.get('type');
    const version = params.get('version');

    if (fileName) {
      this.setState({ selectedFileName: fileName }, () => {
        this.fetchVersions(fileName);
      });
    }

    if (type) this.setState({ selectedType: type });
    if (version) this.setState({ selectedVersion: version });
  }

  fetchOptions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_ENDPOINT}/camunda/get-list`);
      if (!response.ok) {
        throw new Error(`Failed to fetch options: ${response.status}`);
      }
      const data = await response.json();
      const uniqueOptions = [...new Set(data.map((item) => item.key))];
      this.setState({ options: uniqueOptions });
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  fetchVersions = async (fileName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/camunda/get-list?key=${fileName}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch versions: ${response.status}`);
      }
      const data = await response.json();
      const versions = data.map((item) => item.version);
      const defaultVersion = Math.max(...versions); 
      this.setState({
        versions,
        selectedVersion: defaultVersion.toString(),
      });
    } catch (error) {
      console.error('Error fetching versions:', error);
    }
  };

  fetchData = async (fileName, type, version) => {
    try {
      const diagramResponse = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/heatmap/bpmn/${fileName}?version=${version}`
      );
      const diagramXML = await diagramResponse.text();

      const heatmapResponse = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/heatmap/diagram/mapping?filename=${fileName}&type=${type}&version=${version}`
      );
      const heatmapdata = await heatmapResponse.json();

      this.setState({ diagramXML, heatmapdata });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchSubProcess = async (subProcess, fileName, version, type) => {
    try {
      const diagramResponse = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/heatmap/bpmn/subprocess/${fileName}?version=${version}&subprocess=${subProcess}`
      );
      const diagramXML = await diagramResponse.text();
      const response = await fetch(
        `${process.env.REACT_APP_ENDPOINT}/heatmap/diagram/subprocess`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: fileName,
            type,
            version,
            subprocess: subProcess
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sub-process heatmap: ${response.status}`);
      }
  
      const heatmapdata = await response.json();
      
      this.setState({ diagramXML, heatmapdata });
    } catch (error) {
      console.error('Error fetching sub-process heatmap data:', error);
      alert('Gagal memuat data sub-process. Periksa koneksi atau coba lagi.');
    }
  };

  handleFileNameChange = (event) => {
    const selectedFileName = event.target.value;
    this.setState(
      { selectedFileName, diagramXML: null, heatmapdata: null },
      () => {
        this.fetchVersions(selectedFileName);
      }
    );
  };

  handleVersionChange = (event) => {
    const selectedVersion = event.target.value;
    const { selectedFileName, selectedType } = this.state;
  
    this.setState({ selectedVersion, diagramXML: null, heatmapdata: null }, () => {
      if (selectedFileName && selectedType && selectedVersion) {
        this.fetchData(selectedFileName, selectedType, selectedVersion);
      }
    });
  };

  handleTypeChange = (event) => {
    const selectedType = event.target.value;
    const { selectedFileName, selectedVersion } = this.state;

    this.setState({ selectedType, diagramXML: null, heatmapdata: null }, () => {
      if (selectedFileName && selectedType && selectedVersion) {
        this.fetchData(selectedFileName, selectedType, selectedVersion);
      }
    });
  };

  handleSubProcessClick = (subProcessId, fileName, version, type) => {
    const { diagramXML } = this.state;
  
    try {
  
      this.setState({ currentSubProcess: subProcessId });
      this.fetchSubProcess(subProcessId, fileName, version, type,);
    } catch (error) {
      console.error('Error parsing sub-process:', error);
      alert('Terjadi kesalahan saat memuat sub-process!');
    }
  };

  handleBackToMainProcess = () => {
    const { selectedFileName, selectedType, selectedVersion } = this.state;
    this.fetchData(selectedFileName, selectedType, selectedVersion);
    this.setState({
      currentSubProcess: null,
    });
  };

  render() {
    const {
      diagramXML,
      heatmapdata,
      options,
      versions,
      selectedFileName,
      selectedVersion,
      typeOptions,
      selectedType,
      currentSubProcess,
    } = this.state;

    return (
      <div className="container-heatmap">
        <div className='hhh'>

        <SelectInputs
          options={options}
          versions={versions}
          selectedFileName={selectedFileName}
          selectedVersion={selectedVersion}
          selectedType={selectedType}
          typeOptions={typeOptions}
          handleFileNameChange={this.handleFileNameChange}
          handleVersionChange={this.handleVersionChange}
          handleTypeChange={this.handleTypeChange}
          />
          </div>
        
        {currentSubProcess && (
          <div>
            <button onClick={this.handleBackToMainProcess}>Kembali ke Proses Utama</button>
          </div>
        )}

        <div className="test">
          <HeatmapDisplay
            diagramXML={diagramXML}
            heatmapdata={heatmapdata}
            handleSubProcessClick={this.handleSubProcessClick}
            currentSubProcess={currentSubProcess}
            selectedFileName={selectedFileName}
            selectedVersion={selectedVersion}
            selectedType={selectedType}
          />
        </div>
      </div>
    );
  }
}

export default App;
