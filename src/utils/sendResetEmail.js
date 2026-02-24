import nodemailer from "nodemailer";
import createTransporter from "./transporter.js";

const sendResetPasswordEmail = async (email, resetToken, name) => {
  const transporter = createTransporter();

  const resetUrl = `http://localhost:3000/api/v1/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { 
                display: inline-block; 
                padding: 12px 24px; 
                background-color: #dc3545; 
                color: #ffffff; 
                text-decoration: none; 
                border-radius: 4px; 
                margin: 20px 0;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Hi, ${name}!</h2>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
              <p>This link will expire in <strong>30 minutes</strong>.</p>
              <div class="footer">
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
              </div>
            </div>
          </body>
        </html>
      `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;
