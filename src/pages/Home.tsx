import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";

const HomePage: React.FC = () => {
  // State for file upload and user input (multiple key-value pairs)
  const [input, setInput] = useState<string>("");
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [templateContent, setTemplateContent] = useState<string>("");

  const handleInputSubmit = () => {
    // Remove spaces and split input by commas
    const trimmedInput = input.replace(/\s+/g, "");
    const pairs = trimmedInput.split(",");

    let validData: any = {};
    let isValid = true;

    // Regex to match each "key":"value" pair
    const regex = /^"([^"}]+)":"([^"]+)"$/;

    // Validate each key-value pair
    pairs.forEach((pair) => {
      if (regex.test(pair)) {
        const match = pair.match(regex);
        if (match) {
          const key = match[1];
          const value = match[2];
          validData[key] = value;
        }
      } else {
        isValid = false;
      }
    });

    if (isValid && Object.keys(validData).length > 0) {
      setSubmittedData(validData);
      setErrorMessage(""); // Clear any previous errors
      console.log("Submitted Data:", validData);
      // Replace template content with values
      let filledTemplate = templateContent;
      Object.keys(validData).forEach((key) => {
        const regex = new RegExp(`\\$\\{${key}\\}`, "g");
        filledTemplate = filledTemplate.replace(regex, validData[key]);
      });
      setTemplateContent(filledTemplate);
    } else {
      // Show error message if any pair is invalid or input is empty
      setErrorMessage(
        'Please enter key-value pairs in the format: "key":"value" separated by commas.'
      );
    }
  };

  const handleDownloadTemplate = () => {
    const template = `Good morning team,I hope this email finds you well.
                      My name is {NAME}, and I am writing to express my interest in the {POSITION}. I came across this opportunity and am excited about the possibility of contributing to your esteemed organization while developing my skills further.

                      About me:
                      // WRITE A PERSONALISED ABOUT ME SECTION

                      I am eager to bring my skills, where I can contribute to your team while continuing to grow my technical expertise.

                      I have attached my resume for your reference.
                      // YOUR RESUME LINK

                      Thank you for considering my application. I would be thrilled to discuss how my skills and experiences align with your team’s goals.

                      Best regards,
                      {NAME}
                      {EMAIL}`;

    const blob = new Blob([template], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_template.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Cold Mailer</h1>
        <p className="text-lg mb-6 text-gray-600">
          Upload your text file template and provide values for its variables.
        </p>
        <div className="flex justify-center">
          <FileUpload
            name="demo[]"
            url={"/api/upload"}
            multiple
            accept=".txt"
            maxFileSize={1000000}
            chooseLabel="Select Template File"
            uploadLabel="Upload Now"
            cancelLabel="Cancel"
            emptyTemplate={<p className="m-0">No files uploaded</p>}
            className="p-fileupload-custom"
          />
        </div>

        {/* Download Sample Template */}
        <div className="mt-4">
          <Button
            label="Download Sample Template"
            onClick={handleDownloadTemplate}
            className="p-button-outlined p-button-info"
          />
        </div>

        {/* Input for multiple Key-Value Pairs */}
        <div className="mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter multiple key-value pairs (e.g., "name":"Likhit", "age":"25")'
            className="p-inputtext p-component p-inputtext-sm w-full"
          />
        </div>

        {/* Error message for invalid format */}
        {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}

        {/* Button to Submit the Key-Value Pairs */}
        <div className="mt-6">
          <Button
            label="Submit"
            className="p-button-rounded p-button-lg p-button-success"
            onClick={handleInputSubmit}
          />
        </div>

        {/* Display Filled Template */}
        {templateContent && (
          <div className="mt-6 text-left">
            <h3 className="font-bold">Filled Template:</h3>
            <pre>{templateContent}</pre>
          </div>
        )}

        <div className="mt-6">
          <Button
            label="Proceed"
            className="p-button-rounded p-button-lg p-button-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
