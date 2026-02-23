
-- Admin role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Shorthand for checking admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- RLS on user_roles: only admins can read
CREATE POLICY "Admins can view roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- CMS Tables
-- ============================================

-- Hero section content
CREATE TABLE public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_highlight TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  cta_primary_text TEXT NOT NULL DEFAULT '',
  cta_primary_link TEXT NOT NULL DEFAULT '/reservar',
  cta_secondary_text TEXT NOT NULL DEFAULT '',
  cta_secondary_link TEXT NOT NULL DEFAULT '/servicos',
  background_image_url TEXT,
  stats JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read hero" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert hero" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update hero" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete hero" ON public.hero_content FOR DELETE TO authenticated USING (public.is_admin());

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT '🏋️',
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL DEFAULT '',
  full_desc TEXT NOT NULL DEFAULT '',
  sub_services TEXT[] NOT NULL DEFAULT '{}',
  cta_text TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- Pricing plans
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT '/ mês',
  features TEXT[] NOT NULL DEFAULT '{}',
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read pricing" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Admins can insert pricing" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update pricing" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete pricing" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_admin());

-- Instructors
CREATE TABLE public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read instructors" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "Admins can insert instructors" ON public.instructors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update instructors" ON public.instructors FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete instructors" ON public.instructors FOR DELETE TO authenticated USING (public.is_admin());

-- Gallery images
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Todas',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update gallery" ON public.gallery_images FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete gallery" ON public.gallery_images FOR DELETE TO authenticated USING (public.is_admin());

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON public.instructors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

-- Storage policies: public read, admin write
CREATE POLICY "Public can view CMS images" ON storage.objects FOR SELECT USING (bucket_id = 'cms-images');
CREATE POLICY "Admins can upload CMS images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-images' AND public.is_admin());
CREATE POLICY "Admins can update CMS images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-images' AND public.is_admin());
CREATE POLICY "Admins can delete CMS images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-images' AND public.is_admin());
