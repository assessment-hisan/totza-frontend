import React, { useState } from 'react';

const FileUpload = ({ name = "files", multiple = true, onChange }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    onChange && onChange(e); // call parent handler if passed
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Files</label>
      <input
        type="file"
        name={name}
        multiple={multiple}
        onChange={handleFileChange}
        className="block w-full border border-gray-300 rounded-md p-2"
      />
      
      {selectedFiles.length > 0 && (
        <ul className="mt-2 list-disc text-sm text-gray-700 space-y-1 pl-5">
          {selectedFiles.map((file, i) => (
            <li key={i}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
