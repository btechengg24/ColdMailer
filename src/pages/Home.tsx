import React, { useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";

import { sendEmail } from "../services/gmailService";
import { getCurrentUser } from "../services/authServices";

const HomePage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [templateContent, setTemplateContent] = useState<string>("");
  const [processedContent, setProcessedContent] = useState<{
    subject: string;
    body: string;
  } | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [recipientEmail, setRecipientEmail] = useState<string>("");

  const toast = useRef<Toast>(null);

  const handleFileUpload = (e: any) => {
    const file = e.files[0];
    if (!file) return;

    // console.log("file", file);

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

  const handleProcessTemplate = () => {
    const trimmedInput = input.trim();
    const pairs = trimmedInput.split(",");

    let validData: Record<string, string> = {};
    let isValid = true;

    const regex = /^"([^"\\]+)":"([^"\\]+)"$/;

    // Process each key-value pair
    pairs.forEach((pair) => {
      const match = pair.match(regex);
      if (match) {
        validData[match[1]] = match[2];
      } else {
        isValid = false;
      }
    });

    // console.log("validData:", validData);

    if (isValid && Object.keys(validData).length > 0) {
      setErrorMessage("");

      // Assuming the template content is passed in or stored elsewhere
      let replacedContent = templateContent; // templateContent should already have placeholders like {recruiter}, {position}, etc.

      // Replace placeholders with actual values from validData
      Object.keys(validData).forEach((key) => {
        const placeholderRegex = new RegExp(`\\{${key}\\}`, "g");
        replacedContent = replacedContent.replace(
          placeholderRegex,
          validData[key]
        );
      });

      // Extract subject (this should be the first <p> tag with the subject)
      const subjectMatch = replacedContent.match(/<p>Subject: (.*?)<\/p>/);
      const subject = subjectMatch ? subjectMatch[1] : "";

      // Remove the subject from replacedContent to extract just the body
      replacedContent = replacedContent.replace(/<p>Subject:.*?<\/p>/, "");

      // Extract the body content (content between <body> and </body> tags)
      const bodyMatch = replacedContent.match(/<body>([\s\S]*?)<\/body>/);
      const body = bodyMatch ? bodyMatch[1] : "";

      // Set the processed content for modal
      setProcessedContent({ subject, body });
      setShowModal(true);
    } else {
      setErrorMessage(
        'Please enter key-value pairs in the format: "key":"value" separated by commas.'
      );
    }
  };

  const handleDownloadTemplate = () => {
    const sampleTemplate = `
      <html>
        <head>
          <title>Job Application Template</title>
        </head>
        <body>
          <p>Subject: Job Application for {POSITION}</p>
          <p>Good morning {RECRUITER},</p>
          <p>I hope this email finds you well.</p>
          <p>My name is {NAME}, and I am interested in the {POSITION} role at {COMPANY}.</p>
          <p>I am excited about the opportunity and believe my skills can contribute to your organization.</p>
          <p>About me:</p>
          <ul>
            <li></li>
          </ul>
          <p>I have attached my resume for your reference: <a href="{RESUME_LINK}">Your Resume Link</a></p>
          <p>Thank you for considering my application. I would be thrilled to discuss how my skills and experiences align with your team’s goals.</p>
           <p>Best regards,&nbsp;</p>
           <p>{NAME}&nbsp;</p>
           <p><a href="mailto:{EMAIL}">{EMAIL}</a>&nbsp;</p>
        </body>
      </html>
    `;

    const blob = new Blob([sampleTemplate], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sample_template.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendEmail = async () => {
    // console.log("in handleSendEmail");
    if (!recipientEmail || !processedContent) {
      setErrorMessage("Please enter a recipient email and processed content.");
      return;
    }
    // console.log("in handleSendEmail email and content not issue");
    // Get the current authenticated user
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setErrorMessage("You need to sign in with Google first.");
      return;
    }
    // console.log("in handleSendEmail user not issue");
    try {
      // Call the sendEmail function with the recipient, subject, and message
      await sendEmail(
        recipientEmail,
        processedContent.subject, // Send the processed content as the email body
        processedContent.body
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
      <Toast ref={toast} />
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
            auto
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

        {/* {processedContent && (
          <div className="mt-6 text-left">
            <h3 className="font-bold">Processed Template:</h3>
            <pre>{processedContent}</pre>
          </div>
        )} */}

        <div className="mt-6">
          <Button
            label="Proceed"
            className="p-button-rounded p-button-lg p-button-primary"
            onClick={handleProcessTemplate}
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
            {processedContent ? (
              <>
                <h3 className="font-bold">Subject:</h3>
                <pre>{processedContent.subject}</pre>

                <h3 className="font-bold mt-4">Body:</h3>
                <pre>{processedContent.body}</pre>
              </>
            ) : (
              <p>No content available to display.</p>
            )}
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
