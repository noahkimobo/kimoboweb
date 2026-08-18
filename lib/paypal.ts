import 'server-only'

const paypalBaseUrl =
  process.env.PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

function getPayPalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const currency = process.env.PAYPAL_CURRENCY ?? 'USD'
  const rate = Number(process.env.PAYPAL_KES_TO_CURRENCY_RATE)

  if (!clientId || !clientSecret || !Number.isFinite(rate) || rate <= 0) {
    throw new Error(
      'PayPal is not configured. Set PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, and PAYPAL_KES_TO_CURRENCY_RATE.',
    )
  }

  return { clientId, clientSecret, currency, rate }
}

export function convertKesToPayPalCurrency(kesCents: number) {
  const { currency, rate } = getPayPalConfig()
  return { currency, value: (kesCents / 100 / rate).toFixed(2) }
}

async function getAccessToken() {
  const { clientId, clientSecret } = getPayPalConfig()
  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!response.ok) throw new Error('Unable to authenticate with PayPal.')
  return (await response.json()).access_token as string
}

export async function paypalRequest<T>(path: string, init: RequestInit = {}) {
  const token = await getAccessToken()
  const response = await fetch(`${paypalBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message ?? 'PayPal request failed.')
  return body as T
}

export async function sendPayPalInvoice(input: {
  email: string
  name: string
  orderNumber: string
  items: { name: string; quantity: number; price: number }[]
  shipping: number
}) {
  const invoice = await paypalRequest<{ id: string }>('/v2/invoicing/invoices', {
    method: 'POST',
    body: JSON.stringify({
      detail: {
        invoice_number: input.orderNumber,
        currency_code: getPayPalConfig().currency,
        note: 'Thank you for shopping with Kimobo Furnitures.',
        payment_term: { term_type: 'DUE_ON_RECEIPT' },
      },
      primary_recipients: [{
        billing_info: { email_address: input.email, name: { full_name: input.name } },
      }],
      items: input.items.map((item) => ({
        name: item.name,
        quantity: String(item.quantity),
        unit_amount: convertKesToPayPalCurrency(item.price),
      })),
    }),
  })

  await paypalRequest(`/v2/invoicing/invoices/${invoice.id}/send`, {
    method: 'POST',
    body: JSON.stringify({ send_to_recipient: true, send_to_invoicer: false }),
  })
}