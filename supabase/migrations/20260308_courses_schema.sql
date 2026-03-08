-- Create teacher_applications table
CREATE TABLE IF NOT EXISTS public.teacher_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL,
    expertise TEXT NOT NULL,
    bio TEXT NOT NULL,
    experience_years INT DEFAULT 0,
    social_link TEXT,
    sample_topic TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    applied_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    duration TEXT,
    price BIGINT DEFAULT 0,
    thumb_url TEXT,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    rating DECIMAL(3,2) DEFAULT 0,
    students_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- Update profiles table to include is_teacher and coins if they don't exist
-- We assume profiles table exists and is linked to auth.users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_teacher') THEN
        ALTER TABLE public.profiles ADD COLUMN is_teacher BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='coins') THEN
        ALTER TABLE public.profiles ADD COLUMN coins BIGINT DEFAULT 1000; -- Initial bonus
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Policies for teacher_applications
-- Users can see their own applications
CREATE POLICY "Users can view own applications" ON public.teacher_applications
    FOR SELECT USING (auth.uid() = user_id);
-- Users can insert their own applications
CREATE POLICY "Users can create own applications" ON public.teacher_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for courses
-- Everyone can view published courses
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
    FOR SELECT USING (status = 'published');
-- Teachers can manage their own courses
CREATE POLICY "Teachers can manage own courses" ON public.courses
    FOR ALL USING (auth.uid() = teacher_id);

-- Policies for course_enrollments
-- Users can see their own enrollments
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
    FOR SELECT USING (auth.uid() = user_id);
-- Users can enroll (insert)
CREATE POLICY "Users can enroll themselves" ON public.course_enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS courses_category_idx ON public.courses(category);
CREATE INDEX IF NOT EXISTS courses_teacher_id_idx ON public.courses(teacher_id);
CREATE INDEX IF NOT EXISTS course_enrollments_user_id_idx ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS course_enrollments_course_id_idx ON public.course_enrollments(course_id);
