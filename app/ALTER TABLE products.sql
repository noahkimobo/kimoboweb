ALTER TABLE products
  ADD COLUMN IF NOT EXISTS seaters integer NOT NULL DEFAULT 1;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS wood_type text NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS cushion_type text NOT NULL DEFAULT '';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS video_url text;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS bed_size text;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS bottom_bed_size text;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS top_bed_size text;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS double_decker boolean NOT NULL DEFAULT false;