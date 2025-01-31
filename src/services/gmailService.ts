import { getGoogleAccessToken } from "./authServices";

// Create the raw email with base64url encoding
const createRawEmail = (to: string, subject: string, body: string): string => {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset="UTF-8"`, // Changed to text/html
    `MIME-Version: 1.0`,
    "",
    body, // Actual HTML body content
  ].join("\r\n");

  // Base64url encode the email content
  const base64Encoded = base64urlEncode(email);
  return base64Encoded;
};

// Function to base64url encode the raw email content
const base64urlEncode = (str: string) => {
  const base64Encoded = btoa(unescape(encodeURIComponent(str))); // UTF-8 encode before base64
  return base64Encoded
    .replace(/\+/g, "-") // Replace '+' with '-'
    .replace(/\//g, "_") // Replace '/' with '_'
    .replace(/=+$/, ""); // Remove '=' padding
};

// The function that sends the email using Gmail API
export const sendEmail = async (
  recipient: string,
  subject: string,
  message: string
) => {
  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    console.error("No access token found");
    return;
  }

  // Create the raw email
  const rawEmail = createRawEmail(recipient, subject, message);

  try {
    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: rawEmail }),
      }
    );

    console.log("response in sendEmail", response);

    if (!response.ok) {
      throw new Error(`Error sending email: ${response.statusText}`);
    }

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
