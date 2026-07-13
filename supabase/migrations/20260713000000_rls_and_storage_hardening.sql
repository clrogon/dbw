-- Canonical RLS + storage hardening snapshot.
-- Idempotent: drops known policy names then recreates the final PERMISSIVE set.
-- Apply against the live project (supabase db push / SQL editor) after review.

-- ---------------------------------------------------------------------------
-- Ensure is_admin / has_role stay SECURITY DEFINER with fixed search_path
-- ---------------------------------------------------------------------------
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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- ---------------------------------------------------------------------------
-- user_roles: own-row SELECT only (no client write policies)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles " ON public.user_roles;
DROP POLICY IF EXISTS "users_read_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_select" ON public.user_roles;

CREATE POLICY "user_roles_select"
  ON public.user_roles
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Helper: drop all legacy CMS policy names then recreate
-- ---------------------------------------------------------------------------

-- hero_content
DROP POLICY IF EXISTS "Public can read hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can insert hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can update hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can delete hero" ON public.hero_content;
DROP POLICY IF EXISTS "hero_select" ON public.hero_content;
DROP POLICY IF EXISTS "hero_insert" ON public.hero_content;
DROP POLICY IF EXISTS "hero_update" ON public.hero_content;
DROP POLICY IF EXISTS "hero_delete" ON public.hero_content;

CREATE POLICY "hero_select" ON public.hero_content AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "hero_insert" ON public.hero_content AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "hero_update" ON public.hero_content AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "hero_delete" ON public.hero_content AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- services
DROP POLICY IF EXISTS "Public can read services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
DROP POLICY IF EXISTS "services_select" ON public.services;
DROP POLICY IF EXISTS "services_insert" ON public.services;
DROP POLICY IF EXISTS "services_update" ON public.services;
DROP POLICY IF EXISTS "services_delete" ON public.services;

CREATE POLICY "services_select" ON public.services AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "services_insert" ON public.services AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_update" ON public.services AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_delete" ON public.services AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- pricing_plans
DROP POLICY IF EXISTS "Public can read pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can update pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_select" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_insert" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_update" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_delete" ON public.pricing_plans;

CREATE POLICY "pricing_select" ON public.pricing_plans AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "pricing_insert" ON public.pricing_plans AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "pricing_update" ON public.pricing_plans AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pricing_delete" ON public.pricing_plans AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- instructors
DROP POLICY IF EXISTS "Public can read instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can insert instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can update instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can delete instructors" ON public.instructors;
DROP POLICY IF EXISTS "instructors_select" ON public.instructors;
DROP POLICY IF EXISTS "instructors_insert" ON public.instructors;
DROP POLICY IF EXISTS "instructors_update" ON public.instructors;
DROP POLICY IF EXISTS "instructors_delete" ON public.instructors;

CREATE POLICY "instructors_select" ON public.instructors AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "instructors_insert" ON public.instructors AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "instructors_update" ON public.instructors AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "instructors_delete" ON public.instructors AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- gallery_images
DROP POLICY IF EXISTS "Public can read gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_select" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_insert" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_update" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_delete" ON public.gallery_images;

CREATE POLICY "gallery_select" ON public.gallery_images AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "gallery_insert" ON public.gallery_images AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "gallery_update" ON public.gallery_images AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery_delete" ON public.gallery_images AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: cms-images — drop all known legacy names, recreate once
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Public read cms-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload cms-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update cms-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete cms-images" ON storage.objects;

CREATE POLICY "cms_images_select"
  ON storage.objects AS PERMISSIVE FOR SELECT TO public
  USING (bucket_id = 'cms-images');

CREATE POLICY "cms_images_insert"
  ON storage.objects AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cms-images'
    AND public.is_admin()
    AND lower(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp', 'gif'])
  );
  -- Size + MIME limits are enforced on the bucket (file_size_limit / allowed_mime_types below)

CREATE POLICY "cms_images_update"
  ON storage.objects AS PERMISSIVE FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'cms-images' AND public.is_admin());

CREATE POLICY "cms_images_delete"
  ON storage.objects AS PERMISSIVE FOR DELETE TO authenticated
  USING (bucket_id = 'cms-images' AND public.is_admin());

-- Prefer server-enforced limits when the platform supports them
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'cms-images';
