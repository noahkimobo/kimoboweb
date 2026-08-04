import Link from 'next/link'
import { getDashboardStats } from '@/lib/queries'
import { formatPrice } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    { label: 'Products', value: stats.products },
    { label: 'Orders', value: stats.orders },
    { label: 'Pending orders', value: stats.pending },
    { label: 'Revenue', value: formatPrice(stats.revenue) },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your store.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Add product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-semibold tabular-nums">{c.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/admin/products">Manage products →</Link>
        </Button>
      </div>
    </div>
  )
}
