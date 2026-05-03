export const resetPasswordTemplate = (userName, resetUrl) => `
          <div style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px; background-color:#f8fafc;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
          
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <h2 style="margin:0; font-size:22px; font-weight:600; color:#2563eb; letter-spacing:0.2px;">
                Reset Your Password
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 0 32px;">
              <p style="margin:0 0 14px 0; font-size:15px; color:#111827; line-height:1.6;">
                Hi ${userName},
              </p>

              <p style="margin:0 0 20px 0; font-size:15px; color:#374151; line-height:1.6;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:10px 32px 26px 32px;">
              <a href="${resetUrl}" 
                 style="background:#2563eb; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:11px 26px; border-radius:6px; display:inline-block;">
                Reset Password
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px; background:#e5e7eb;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px 32px;">
              <p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; line-height:1.5;">
                If the button doesn't work, copy and paste this link:
              </p>

              <p style="margin:0 0 14px 0; font-size:12px; color:#2563eb; word-break:break-all;">
                ${resetUrl}
              </p>

              <p style="margin:0; font-size:12px; color:#9ca3af;">
                Link expires in 1 hour. If you didn't request this, please ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding-top:16px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#9ca3af;">
                © SADHN • All rights reserved
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</div>
        `;
