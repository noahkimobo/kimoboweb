ALTER TABLE community_jobs
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'other';

ALTER TABLE community_jobs
  ADD COLUMN IF NOT EXISTS employer_phone text NOT NULL DEFAULT '';
