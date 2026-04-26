
CREATE TABLE content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES content_slots(id),
  rotation_order INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 5,  -- minutes
  created_at TIMESTAMPTZ DEFAULT NOW()
);