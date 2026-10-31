import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { communityJobs } from '@/lib/db/schema'
import { parseCommunityJobInput } from '@/lib/community-jobs'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const parsed = parseCommunityJobInput(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const { title, slug, description, location } = parsed.value
  if (!title || !slug || !description || !location) {
    return NextResponse.json(
      { error: 'Title, slug, description, and location are required.' },
      { status: 400 },
    )
  }

  try {
    const [job] = await db
      .insert(communityJobs)
      .values({ ...parsed.value, title, slug, description, location })
      .returning()

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Failed to create community job:', error)
    const message = error instanceof Error ? error.message : ''
    const duplicate = message.includes('community_jobs_slug_unique') || message.includes('duplicate key')
    return NextResponse.json(
      { error: duplicate ? 'That job URL is already in use.' : 'Could not save this job listing.' },
      { status: 400 },
    )
  }
}
