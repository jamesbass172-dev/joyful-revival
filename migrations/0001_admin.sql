-- Cloudflare D1 schema for the Joyful Montessori admin portal.
-- Apply with: wrangler d1 execute joyco-admin --file=migrations/0001_admin.sql --remote

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,                -- JM0001-style
  full_name TEXT NOT NULL,
  photo_url TEXT,
  date_of_birth TEXT,                 -- ISO YYYY-MM-DD
  sex TEXT CHECK(sex IN ('Male','Female')),
  admission_number TEXT,
  admission_date TEXT,
  home_address TEXT,
  guardian_name TEXT,
  guardian_relationship TEXT,
  guardian_phone TEXT,
  guardian_alt_phone TEXT,
  guardian_email TEXT,
  guardian_occupation TEXT,
  guardian_address TEXT,
  emergency_contact TEXT,
  class TEXT CHECK(class IN ('Baby Class','P One','P Two')),
  session TEXT CHECK(session IN ('Noon','Evening')),
  status TEXT DEFAULT 'Active' CHECK(status IN ('Active','Graduated','Transferred','Withdrawn')),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
  student_id TEXT NOT NULL,
  day TEXT NOT NULL,                  -- ISO YYYY-MM-DD
  status TEXT CHECK(status IN ('Present','Absent','Sick','Permission')),
  time_in TEXT,
  time_out TEXT,
  PRIMARY KEY (student_id, day),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS food_contributions (
  student_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,             -- 1..12
  required_amount INTEGER DEFAULT 0,
  paid_amount INTEGER DEFAULT 0,
  fund_type TEXT CHECK(fund_type IN ('Parent Contribution','JOYCO Fund')),
  PRIMARY KEY (student_id, year, month),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('school_name', 'Joyful Montessori Nursery & Day Care'),
  ('monthly_food_contribution', '20000'),
  ('academic_year', '2026');
