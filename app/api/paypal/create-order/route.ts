import { NextResponse } from 'next/server'
import { inArray } from 'drizzle-orm'
import { calcShipping } from '@/lib/format'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { convertKesToPayPalCurrency, paypalRequest } from '@/lib/paypal'

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as {
      items?: { productId: number; quantity: number }[]
    }
    if (!items?.length) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })

    const productsInCart = await db.select().from(products).where(inArray(products.id, items.map((item) => item.productId)))
    if (productsInCart.length !== items.length) throw new Error('One or more products are no longer available.')
    const subtotal = items.reduce((sum, item) => {
      const product = productsInCart.find((candidate) => candidate.id === item.productId)
      if (!product || item.quantity < 1 || item.quantity > product.stock) throw new Error('One or more products do not have enough stock.')
      return sum + product.price * item.quantity
    }, 0)
    const total = subtotal + calcShipping(subtotal)
    const amount = convertKesToPayPalCurrency(total)
    const order = await paypalRequest<{ id: string }>('/v2/checkout/orders', {
      method: 'POST',
      headers: { 'PayPal-Request-Id': crypto.randomUUID() },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: amount.currency, value: amount.value } }],
      }),
    })
    return NextResponse.json({ id: order.id })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to start PayPal checkout.' }, { status: 500 })
  }
}