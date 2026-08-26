'use client'

import { useState } from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCart } from '@/components/cart/cart-provider'
import { calcShipping, formatPrice } from '@/lib/format'

type Customer = { name: string; email: string; phone: string; address: string; city: string; postalCode: string; country: string }

const emptyCustomer: Customer = { name: '', email: '', phone: '', address: '', city: '', postalCode: '', country: 'Kenya' }

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const [customer, setCustomer] = useState(emptyCustomer)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState('')
  const shipping = calcShipping(subtotal)
  const total = subtotal + shipping
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const currency = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY ?? 'USD'

  function updateCustomer(field: keyof Customer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  if (success) {
    return <main className="mx-auto max-w-2xl px-6 py-20 text-center"><h1 className="font-serif text-4xl">Thank you for your order</h1><p className="mt-4 text-muted-foreground">Order {success} has been paid. Your PayPal invoice will arrive by email.</p></main>
  }

  if (!items.length) {
    return <main className="mx-auto max-w-2xl px-6 py-20 text-center"><h1 className="font-serif text-4xl">Your cart is empty</h1><p className="mt-4 text-muted-foreground">Add a product before checking out.</p></main>
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <h1 className="font-serif text-4xl">Checkout</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" value={customer.name} onChange={(value) => updateCustomer('name', value)} required />
            <Field label="Email" type="email" value={customer.email} onChange={(value) => updateCustomer('email', value)} required />
            <Field label="Phone" value={customer.phone} onChange={(value) => updateCustomer('phone', value)} />
            <Field label="Country" value={customer.country} onChange={(value) => updateCustomer('country', value)} required />
            <div className="sm:col-span-2"><Field label="Delivery address" value={customer.address} onChange={(value) => updateCustomer('address', value)} required /></div>
            <Field label="City" value={customer.city} onChange={(value) => updateCustomer('city', value)} required />
            <Field label="Postal code" value={customer.postalCode} onChange={(value) => updateCustomer('postalCode', value)} />
          </div>
          <div className="border-t border-border pt-6">
            <h2 className="font-serif text-2xl">Pay with PayPal</h2>
            <p className="mt-2 text-sm text-muted-foreground">You will be redirected to PayPal to approve the payment.</p>
            {message && <p className="mt-4 text-sm text-destructive">{message}</p>}
            {clientId ? <PayPalScriptProvider options={{ clientId, currency, intent: 'capture' }}><PayPalButtons style={{ layout: 'vertical' }} createOrder={async () => { const response = await fetch('/api/paypal/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })) }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); return data.id }} onApprove={async (data) => { const response = await fetch('/api/paypal/capture-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: data.orderID, customer, items: items.map((item) => ({ productId: item.productId, color: item.color, quantity: item.quantity })) }) }); const result = await response.json(); if (!response.ok) { setMessage(result.error); return } clear(); setSuccess(result.orderNumber) }} onError={() => setMessage('PayPal could not process this payment. Please try again.')} /></PayPalScriptProvider> : <p className="mt-4 text-sm text-destructive">PayPal is not configured yet. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID in Vercel.</p>}
          </div>
        </section>
        <aside className="h-fit border border-border p-6">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <div className="mt-5 space-y-3">{items.map((item) => <div key={`${item.productId}-${item.color}`} className="flex justify-between gap-4 text-sm"><span>{item.name} x {item.quantity}</span><span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span></div>)}</div>
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'Free'}</span></div><div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div></div>
        </aside>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return <div className="space-y-2"><Label>{label}{required && ' *'}</Label><Input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} /></div>
}