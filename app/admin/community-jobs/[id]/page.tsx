import { notFound } from 'next/navigation'
import { getCommunityJobs } from '@/lib/queries'
import { CommunityJobForm } from '../job-form'

export const dynamic = 'force-dynamic'

export default async function EditCommunityJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const jobId = Number(id)
  if (!Number.isInteger(jobId) || jobId < 1) notFound()

  const jobs = await getCommunityJobs(true)
  const job = jobs.find((entry) => entry.id === jobId)
  if (!job) notFound()

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
        Edit community opportunity
      </h1>
      <CommunityJobForm job={job} />
    </div>
  )
}
