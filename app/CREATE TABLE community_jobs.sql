CREATE TABLE IF NOT EXISTS community_jobs (
  id serial PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'other',
  description text NOT NULL,
  requirements text NOT NULL DEFAULT '',
  location text NOT NULL,
  employer_phone text NOT NULL DEFAULT '',
  compensation text NOT NULL DEFAULT '',
  closes_at timestamptz,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_jobs_public_idx
  ON community_jobs (published, created_at DESC);
