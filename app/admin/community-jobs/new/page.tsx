import { CommunityJobForm } from '../job-form'

export default function NewCommunityJobPage() {
  return (
    <div>
      <h1 className="mb-2 font-serif text-2xl font-semibold tracking-tight">
        Add community opportunity
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Share clear details so applicants know the work, location, and pay before applying.
      </p>
      <CommunityJobForm />
    </div>
  )
}
