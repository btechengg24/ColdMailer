import React, { useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import { sendEmail } from "../services/gmailService";
import { getCurrentUser } from "../services/authServices";

const HomePage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [templateContent, setTemplateContent] = useState<string>("");
  const [processedContent, setProcessedContent] = useState<string>("");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [recipientEmail, setRecipientEmail] = useState<string>("");

  const handleFileUpload = (e: any) => {
    const toast = useRef<Toast>(null);
    const file = e.files[0];
    if (!file) return;

    console.log("file", file);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        setTemplateContent(event.target.result as string);
        toast.current?.show({
          severity: "success",
          summary: "Upload Successful",
          detail: `File "${file.name}" uploaded successfully.`,
          life: 3000, // Toast duration in milliseconds
        });
      }
    };
    reader.readAsText(file);
  };

  const handleInputSubmit = () => {
    const trimmedInput = input.replace(/\s+/g, "");
    const pairs = trimmedInput.split(",");

    let validData: any = {};
    let isValid = true;

    const regex = /^"([^"\\]+)":"([^"\\]+)"$/;

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

    console.log("validData", validData);

    if (isValid && Object.keys(validData).length > 0) {
      setSubmittedData(validData);
      setErrorMessage("");
      let replacedContent = templateContent;
      Object.keys(validData).forEach((key) => {
        const regex = new RegExp(`\\{${key}\\}`, "g");
        replacedContent = replacedContent.replace(regex, validData[key]);
      });
      setProcessedContent(replacedContent);
    } else {
      setErrorMessage(
        'Please enter key-value pairs in the format: "key":"value" separated by commas.'
      );
    }
  };

  const handleDownloadTemplate = () => {
    const sampleTemplate = "Hello, my name is {name} and I am {age} years old.";
    const blob = new Blob([sampleTemplate], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_template.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !processedContent) {
      setErrorMessage("Please enter a recipient email and processed content.");
      return;
    }

    // Get the current authenticated user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setErrorMessage("You need to sign in with Google first.");
      return;
    }

    try {
      // Call the sendEmail function with the recipient, subject, and message
      await sendEmail(
        recipientEmail,
        "Processed Template", // Use a fixed or dynamic subject
        processedContent // Send the processed content as the email body
      );

      // If successful, show success message or close the modal
      console.log("Email sent successfully!");
      setShowModal(false); // Close the modal
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error sending email:", error);
      setErrorMessage("Failed to send email. Please try again later.");
    }
  };

  return (
    <div>
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Cold Mailer</h1>
        <p className="text-lg mb-6 text-gray-600">
          Upload your text file template and provide values for its variables.
        </p>
        <div className="flex justify-center mb-6 gap-4">
          <FileUpload
            mode="basic"
            name="demo[]"
            accept=".txt"
            maxFileSize={100000}
            chooseLabel="Select Template File"
            // auto
            customUpload
            uploadHandler={handleFileUpload}
            className="p-button-outlined"
          />

          <Button
            label="Download Sample Template"
            onClick={handleDownloadTemplate}
            className="p-button-outlined p-button-info"
          />
        </div>

        <div className="mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter key-value pairs (e.g., "name":"Likhit", "age":"25")'
            className="p-inputtext p-component p-inputtext-sm w-full"
          />
        </div>

        {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}

        <div className="mt-6">
          <Button
            label="Submit"
            className="p-button-rounded p-button-lg p-button-success"
            onClick={handleInputSubmit}
          />
        </div>

        {processedContent && (
          <div className="mt-6 text-left">
            <h3 className="font-bold">Processed Template:</h3>
            <pre>{processedContent}</pre>
          </div>
        )}

        <div className="mt-6">
          <Button
            label="Proceed"
            className="p-button-rounded p-button-lg p-button-primary"
            onClick={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* Modal for Proceed Button */}
      <Dialog
        header="Proceed with Email"
        visible={showModal}
        style={{ width: "50vw" }}
        onHide={() => setShowModal(false)}
      >
        <div className="text-center">
          <p className="font-bold mb-4">Processed Content</p>
          <div className="mb-4 text-left">
            <pre>{processedContent}</pre>
          </div>

          <div className="mt-4">
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient email"
              className="p-inputtext p-component p-inputtext-sm w-full"
            />
          </div>

          <div className="mt-4">
            <Button
              label="Send Email"
              className="p-button-rounded p-button-lg p-button-success"
              onClick={handleSendEmail}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default HomePage;
