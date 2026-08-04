'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

const DEFAULT_RESTOCK_QTY = 10

export function StockToggle({
  productId,
  stock,
}: {
  productId: number
  stock: number
}) {
  const router = useRouter()
  const [inStock, setInStock] = useState(stock > 0)
  const [isPending, startTransition] = useTransition()

  async function handleChange(checked: boolean) {
    setInStock(checked)
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: checked ? DEFAULT_RESTOCK_QTY : 0 }),
      })
      if (!res.ok) {
        setInStock(!checked)
        toast.error('Could not update stock status.')
        return
      }
      toast.success(checked ? 'Marked in stock' : 'Marked out of stock')
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Switch checked={inStock} onCheckedChange={handleChange} disabled={isPending} />
      <span className="text-xs text-muted-foreground">
        {inStock ? 'In stock' : 'Out of stock'}
      </span>
    </div>
  )
}
