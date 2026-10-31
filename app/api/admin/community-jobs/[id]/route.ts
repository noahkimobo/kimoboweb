import { NextResponse, type NextRequest } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { communityJobs } from '@/lib/db/schema'
import { parseCommunityJobInput } from '@/lib/community-jobs'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const jobId = Number(id)
  if (!Number.isInteger(jobId) || jobId < 1) {
    return NextResponse.json({ error: 'Invalid job id.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const parsed = parseCommunityJobInput(body, true)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  try {
    const [job] = await db
      .update(communityJobs)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(eq(communityJobs.id, jobId))
      .returning()

    if (!job) {
      return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 })
    }
    return NextResponse.json({ job })
  } catch (error) {
    console.error('Failed to update community job:', error)
    const message = error instanceof Error ? error.message : ''
    const duplicate = message.includes('community_jobs_slug_unique') || message.includes('duplicate key')
    return NextResponse.json(
      { error: duplicate ? 'That job URL is already in use.' : 'Could not save this job listing.' },
      { status: 400 },
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params
  const jobId = Number(id)
  if (!Number.isInteger(jobId) || jobId < 1) {
    return NextResponse.json({ error: 'Invalid job id.' }, { status: 400 })
  }

  const [job] = await db
    .delete(communityJobs)
    .where(eq(communityJobs.id, jobId))
    .returning({ id: communityJobs.id })

  if (!job) {
    return NextResponse.json({ error: 'Job listing not found.' }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
