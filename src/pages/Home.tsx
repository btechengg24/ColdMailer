import React from "react";
import { FileUpload } from "primereact/fileupload";

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Cold Mailer</h1>
        <p className="text-lg mb-6 text-gray-600">
          Easily upload your files and get started instantly.
        </p>
        <div className="flex justify-center">
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="image/*"
            maxFileSize={1000000}
            // onUpload={onUpload}
          />
        </div>
        <div className="mt-6"></div>
      </div>
    </div>
  );
};

export default HomePage;
