-- ─────────────────────────────────────────────────────────────
-- ChefMii Academy: Course & Learning Management
-- Tables for courses, modules, lessons, and enrollments
-- ─────────────────────────────────────────────────────────────

-- Course types: 'self-paced' (Domestika style), 'cohort' (Maven style)
CREATE TYPE academy_course_type AS ENUM ('self-paced', 'cohort');
CREATE TYPE academy_enrollment_status AS ENUM ('active', 'completed', 'dropped');

-- ── Academy Courses ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    emoji TEXT,
    thumbnail_url TEXT,
    price DECIMAL(10, 2) NOT NULL,
    course_type academy_course_type DEFAULT 'self-paced',
    level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    total_hours INTEGER,
    next_cohort_date TIMESTAMPTZ,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Course Modules ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academy_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Course Lessons ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academy_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES academy_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT, -- Markdown or rich text
    video_url TEXT,
    duration_minutes INTEGER,
    "order" INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT FALSE, -- Available for free preview
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Academy Enrollments ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS academy_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
    status academy_enrollment_status DEFAULT 'active',
    progress_percent INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ── Lesson Progress ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academy_lesson_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID REFERENCES academy_enrollments(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES academy_lessons(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    UNIQUE(enrollment_id, lesson_id)
);

-- ── Academy Reviews ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS academy_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES academy_courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ── RLS ────────────────────────────────────────────────────────
ALTER TABLE academy_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_reviews ENABLE ROW LEVEL SECURITY;

-- Courses: Everyone can see published courses
CREATE POLICY "courses_read_published" ON academy_courses FOR SELECT USING (is_published = true);
CREATE POLICY "courses_read_own" ON academy_courses FOR SELECT USING (auth.uid() = instructor_id);
CREATE POLICY "courses_manage" ON academy_courses FOR ALL USING (auth.uid() = instructor_id);

-- Modules/Lessons: Everyone can see lessons for courses they are enrolled in or preview lessons
CREATE POLICY "modules_read" ON academy_modules FOR SELECT USING (
    EXISTS (SELECT 1 FROM academy_enrollments WHERE course_id = academy_modules.course_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM academy_courses WHERE id = academy_modules.course_id AND instructor_id = auth.uid())
);

CREATE POLICY "lessons_read" ON academy_lessons FOR SELECT USING (
    is_preview = true
    OR EXISTS (
        SELECT 1 FROM academy_modules m
        JOIN academy_enrollments e ON e.course_id = m.course_id
        WHERE m.id = module_id AND e.user_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM academy_modules m
        JOIN academy_courses c ON c.id = m.course_id
        WHERE m.id = module_id AND c.instructor_id = auth.uid()
    )
);

-- Enrollments: Users can see their own enrollments, instructors can see enrollments for their courses
CREATE POLICY "enrollments_read_own" ON academy_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "enrollments_read_instructor" ON academy_enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM academy_courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- Review: Everyone can read, enrolled can create
CREATE POLICY "reviews_read" ON academy_reviews FOR SELECT USING (true);
CREATE POLICY "reviews_create" ON academy_reviews FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM academy_enrollments WHERE course_id = academy_reviews.course_id AND user_id = auth.uid())
);

-- Triggers for Updated At
CREATE TRIGGER update_academy_courses_updated_at BEFORE UPDATE ON academy_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academy_modules_updated_at BEFORE UPDATE ON academy_modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academy_lessons_updated_at BEFORE UPDATE ON academy_lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
