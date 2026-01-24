import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return Response.json({ ok: false, error: 'invalid_content_type' }, { status: 400 })
    }

    const body = (await req.json()) as {
      name?: string
      email?: string
      company?: string
      message?: string
      companyWebsite?: string
    }

    // Honeypot (bots)
    if (typeof body.companyWebsite === 'string' && body.companyWebsite.trim().length > 0) {
      return Response.json({ ok: true }, { status: 200 })
    }

    const name = (body.name || '').trim()
    const email = (body.email || '').trim()
    const company = (body.company || '').trim()
    const message = (body.message || '').trim()

    if (!name || !email || !message) {
      return Response.json({ ok: false, error: 'missing_fields' }, { status: 400 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || '0')
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const to = process.env.CONTACT_TO || process.env.SMTP_USER
    const from = process.env.CONTACT_FROM || process.env.SMTP_USER
    const secure = (process.env.SMTP_SECURE || '').toLowerCase() === 'true'

    if (!host || !port || !user || !pass || !to || !from) {
      return Response.json(
        { ok: false, error: 'smtp_not_configured' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    })

    const subject = `Nuovo contatto - ${name}${company ? ` (${company})` : ''}`
    const text = [
      'Nuova richiesta dal sito Metis',
      '',
      `Nome: ${name}`,
      `Email: ${email}`,
      company ? `Azienda: ${company}` : null,
      '',
      'Messaggio:',
      message,
      '',
      `Ricevuto: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n')

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: email,
    })

    return Response.json({ ok: true }, { status: 200 })
  } catch {
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
