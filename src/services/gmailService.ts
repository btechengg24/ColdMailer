import { getGoogleAccessToken } from "./authServices";

const createRawEmail = (to: string, subject: string, body: string): string => {
  const email =
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/plain; charset="UTF-8"\r\n` +
    `MIME-Version: 1.0\r\n\r\n` +
    body;

  // Proper UTF-8 encoding using TextEncoder & Base64
  const encodedEmail = new TextEncoder().encode(email);
  const base64Encoded = btoa(String.fromCharCode(...encodedEmail))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, ""); // Remove padding

  return base64Encoded;
};

export const sendEmail = async (
  recipient: string,
  subject: string,
  message: string
) => {
  const accessToken = await getGoogleAccessToken();
  console.log("accessToken", accessToken);
  
  if (!accessToken) {
    console.error("No access token found");
    return;
  }

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

    if (!response.ok) {
      throw new Error(`Error sending email: ${response.statusText}`);
    }

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
