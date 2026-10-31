import Link from 'next/link'
import { getCommunityJobs } from '@/lib/queries'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function AdminCommunityJobsPage() {
  const jobs = await getCommunityJobs(true)
  const now = new Date()

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Community jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? 'listing' : 'listings'} · Manage daily opportunities.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/community-jobs/new">Add opportunity</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const expired = job.closesAt !== null && job.closesAt <= now
              const status = expired ? 'Expired' : job.published ? 'Published' : 'Draft'

              return (
                <TableRow key={job.id}>
                  <TableCell>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.slug}</p>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant={job.published && !expired ? 'default' : 'secondary'}>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.closesAt
                      ? new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium' }).format(job.closesAt)
                      : 'No deadline'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/community-jobs/${job.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No opportunities yet. Add a listing to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
