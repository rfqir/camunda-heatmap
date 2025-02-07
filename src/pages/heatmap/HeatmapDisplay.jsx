/* eslint-disable */
import React from 'react';
import EditorBasic from '../../containers';

const HeatmapDisplay = ({ diagramXML, heatmapdata, handleSubProcessClick, currentSubProcess, selectedFileName, selectedVersion, selectedType }) => (
  <div className="heatmap">
    {diagramXML && heatmapdata ? (
      heatmapdata.length > 0 ? (
        <div className="editor-container">
          <EditorBasic
            key={currentSubProcess || "main-process"}
            heatmapdata={heatmapdata}
            diagramXML={diagramXML}
            onSubProcessClick={handleSubProcessClick}
          />
          <table
            className="heatmap-table"
            border="1"
            style={{
              marginTop: "20px",
              marginLeft: "auto",
              marginRight: "auto",
              width: "60%",
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
                  <td>
                    {data.nameTask || "No Task Names"}
                    {data.type === "subProcess" && (
                      <button onClick={() => handleSubProcessClick(data.actId, selectedFileName, selectedVersion, selectedType)}>
                        Masuk Sub-process
                      </button>
                    )}
                  </td>
                  <td>{parseInt(data.runCount) || 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>Tidak ada data yang tersedia.</div>
      )
    ) : (
      <div>
        {selectedFileName && selectedType
          ? "Loading data diagram dan heatmap..."
          : "Silakan pilih diagram, versi, dan type untuk memulai."}
      </div>
    )}
  </div>
);

export default HeatmapDisplay;
