export type EmailRow = { label: string; value: string }

export function renderEmailHtml({
  heading,
  subheading,
  rows,
  message,
  photoCids,
}: {
  heading: string
  subheading?: string
  rows: EmailRow[]
  message?: string
  photoCids?: string[]
}) {
  const rowsHtml = rows
    .map(
      (row) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e5e5e2;color:#85888f;font-size:13px;font-weight:600;white-space:nowrap;padding-right:24px;">${escapeHtml(row.label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #e5e5e2;color:#14120d;font-size:14px;font-weight:700;">${escapeHtml(row.value)}</td>
        </tr>`
    )
    .join('')

  const messageHtml = message
    ? `
      <tr><td colspan="2" style="padding-top:24px;">
        <div style="color:#85888f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Message</div>
        <div style="color:#14120d;font-size:14px;line-height:1.6;white-space:pre-line;">${escapeHtml(message)}</div>
      </td></tr>`
    : ''

  const photosHtml = photoCids && photoCids.length
    ? `
      <div style="margin-top:28px;">
        <div style="color:#85888f;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;">Photos</div>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          ${photoCids
            .map(
              (cid) =>
                `<td style="padding:0 8px 8px 0;"><img src="cid:${cid}" width="140" height="105" style="width:140px;height:105px;object-fit:cover;display:block;background:#eee;" /></td>`
            )
            .join('')}
        </tr></table>
      </div>`
    : ''

  return `
  <div style="background:#f3f3f1;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e2;">
      <tr><td style="background:#14120d;padding:20px 28px;">
        <span style="color:#ffffff;font-size:18px;font-weight:700;">Planète<span style="color:#e61e32;"> Auto</span></span>
      </td></tr>
      <tr><td style="padding:28px;">
        <h1 style="margin:0 0 4px;color:#14120d;font-size:20px;font-weight:700;">${escapeHtml(heading)}</h1>
        ${subheading ? `<p style="margin:0 0 20px;color:#85888f;font-size:13px;">${escapeHtml(subheading)}</p>` : '<div style="margin-bottom:20px;"></div>'}
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          ${rowsHtml}
          ${messageHtml}
        </table>
        ${photosHtml}
      </td></tr>
      <tr><td style="padding:16px 28px;background:#f7f7f5;border-top:1px solid #e5e5e2;">
        <span style="color:#85888f;font-size:11px;">Planète Auto · 2371 Route de Lavérune, 34430 Saint-Jean-de-Védas</span>
      </td></tr>
    </table>
  </div>`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] as string))
}
