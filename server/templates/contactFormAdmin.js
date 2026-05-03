export const contactFormAdminTemplate = (name, email, subject, message) => `
          <div style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px; background-color:#f8fafc;">
    <tr>
      <td align="center">
        
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
          
          <tr>
            <td style="padding:28px 32px 8px 32px;">
              <h2 style="margin:0; font-size:22px; font-weight:600; color:#2563eb; letter-spacing:0.2px;">
                New Contact Submission
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 0 32px;">
              <p style="margin:0 0 20px 0; font-size:15px; color:#374151; line-height:1.6;">
                A new message has been received from your contact form.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 20px 32px;">
              <div style="background:#f0f4f8; border:1px solid #e2e8f0; border-radius:6px; padding:14px;">
                <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280;">
                  <strong>From:</strong> ${name}
                </p>
                <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280;">
                  <strong>Email:</strong> ${email}
                </p>
                <p style="margin:0 0 12px 0; font-size:13px; color:#6b7280;">
                  <strong>Subject:</strong> ${subject}
                </p>
                <p style="margin:0; font-size:13px; color:#6b7280;">
                  <strong>Message:</strong>
                </p>
                <p style="margin:8px 0 0 0; font-size:13px; color:#111827; line-height:1.6; white-space:pre-wrap;">
                  ${message}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px; background:#e5e7eb;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px 32px;">
              <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.5;">
                Please respond to this message as soon as possible.
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
