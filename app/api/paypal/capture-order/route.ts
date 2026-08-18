import { NextResponse } from 'next/server'
import { inArray } from 'drizzle-orm'
import { calcShipping } from '@/lib/format'
import { db } from '@/lib/db'
import { orders, products } from '@/lib/db/schema'
import { paypalRequest, sendPayPalInvoice } from '@/lib/paypal'

type CheckoutItem = { productId: number; color: string | null; quantity: number }

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      orderId?: string
      customer?: { name: string; email: string; phone: string; address: string; city: string; postalCode: string; country: string }
      items?: CheckoutItem[]
    }
    if (!body.orderId || !body.customer?.name || !body.customer.email || !body.items?.length) {
      return NextResponse.json({ error: 'Complete your contact and delivery details.' }, { status: 400 })
    }

    const captured = await paypalRequest<{ status: string }>(`/v2/checkout/orders/${body.orderId}/capture`, { method: 'POST' })
    if (captured.status !== 'COMPLETED') throw new Error('PayPal payment was not completed.')

    const productsInCart = await db.select().from(products).where(inArray(products.id, body.items.map((item) => item.productId)))
    if (productsInCart.length !== body.items.length) throw new Error('One or more products are no longer available.')
    const detailedItems = body.items.map((item) => {
      const product = productsInCart.find((candidate) => candidate.id === item.productId)!
      if (item.quantity < 1 || item.quantity > product.stock) throw new Error(`${product.name} does not have enough stock.`)
      return { productId: product.id, name: product.name, slug: product.slug, image: product.images[0] ?? '', color: item.color, price: product.price, quantity: item.quantity }
    })
    const subtotal = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = calcShipping(subtotal)
    const orderNumber = `KMB-${Date.now().toString(36).toUpperCase()}`
    await db.insert(orders).values({
      orderNumber, customerName: body.customer.name, customerEmail: body.customer.email, customerPhone: body.customer.phone,
      shippingAddress: body.customer.address, city: body.customer.city, postalCode: body.customer.postalCode, country: body.customer.country,
      items: detailedItems, subtotal, shipping, total: subtotal + shipping, paymentMethod: 'paypal', status: 'paid',
    })

    let invoiceSent = true
    try {
      await sendPayPalInvoice({ email: body.customer.email, name: body.customer.name, orderNumber, items: detailedItems, shipping })
    } catch {
      invoiceSent = false
    }
    return NextResponse.json({ orderNumber, invoiceSent })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to complete payment.' }, { status: 500 })
  }
}