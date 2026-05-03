import { Resend } from "resend";
import { config } from "../config/env.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (config.NODE_ENV === "test") {
      return { id: "test-email" };
    }

    const data = await resend.emails.send({
      from: config.EMAIL_FROM,
      to: config.EMAIL_TO,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send email");
  }
};
