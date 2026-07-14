export interface EmailTemplateResult {
  subject: string;
  html: string;
  text: string;
}

export const getVerificationTemplate = (name: string, url: string): EmailTemplateResult => {
  const subject = 'Verify Your Email Address';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px 32px;
          line-height: 1.6;
        }
        .content h2 {
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          color: #111827;
        }
        .content p {
          color: #4b5563;
          font-size: 16px;
        }
        .btn-container {
          text-align: center;
          margin: 32px 0;
        }
        .btn {
          display: inline-block;
          background-color: #4f46e5;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #4338ca;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 24px 32px;
          text-align: center;
          font-size: 14px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
        }
        .footer a {
          color: #4f46e5;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to RHC App</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for signing up! Please verify your email address by clicking the button below to activate your account.</p>
          <div class="btn-container">
            <a href="${url}" class="btn" target="_blank">Verify Email Address</a>
          </div>
          <p>If you did not create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The RHC Team</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us or visit our <a href="#">Help Center</a>.</p>
          <p>&copy; ${new Date().getFullYear()} RHC Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text = `Hi ${name || 'there'},\n\nThank you for signing up! Please verify your email address by visiting this link: ${url}\n\nIf you did not create an account, you can safely ignore this email.\n\nBest regards,\nThe RHC Team`;

  return { subject, html, text };
};

export const getPasswordResetTemplate = (name: string, url: string): EmailTemplateResult => {
  const subject = 'Reset Your Password';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: #f9fafb;
          color: #1f2937;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .header {
          background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
          padding: 32px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.025em;
        }
        .content {
          padding: 40px 32px;
          line-height: 1.6;
        }
        .content h2 {
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          color: #111827;
        }
        .content p {
          color: #4b5563;
          font-size: 16px;
        }
        .btn-container {
          text-align: center;
          margin: 32px 0;
        }
        .btn {
          display: inline-block;
          background-color: #ef4444;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);
          transition: background-color 0.2s;
        }
        .btn:hover {
          background-color: #dc2626;
        }
        .footer {
          background-color: #f3f4f6;
          padding: 24px 32px;
          text-align: center;
          font-size: 14px;
          color: #9ca3af;
          border-top: 1px solid #e5e7eb;
        }
        .footer a {
          color: #ef4444;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RHC App Support</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hi ${name || 'there'},</p>
          <p>You are receiving this email because we received a password reset request for your account. Click the button below to choose a new password.</p>
          <div class="btn-container">
            <a href="${url}" class="btn" target="_blank">Reset Password</a>
          </div>
          <p><strong>Note:</strong> This link is valid for 1 hour. If you did not request a password reset, no further action is required.</p>
          <p>Best regards,<br>The RHC Team</p>
        </div>
        <div class="footer">
          <p>Need help? Contact us or visit our <a href="#">Help Center</a>.</p>
          <p>&copy; ${new Date().getFullYear()} RHC Inc. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const text = `Hi ${name || 'there'},\n\nYou are receiving this email because we received a password reset request for your account. Please reset your password by visiting this link:\n\n${url}\n\nNote: This link is valid for 1 hour. If you did not request a password reset, no further action is required.\n\nBest regards,\nThe RHC Team`;

  return { subject, html, text };
};
