
-- F-03: Fix RLS policy drift — admin write policies should target authenticated role
-- and use schema-qualified public.is_admin()

-- hero_content
DROP POLICY IF EXISTS "hero_insert" ON public.hero_content;
DROP POLICY IF EXISTS "hero_update" ON public.hero_content;
DROP POLICY IF EXISTS "hero_delete" ON public.hero_content;

CREATE POLICY "hero_insert" ON public.hero_content AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "hero_update" ON public.hero_content AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "hero_delete" ON public.hero_content AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- services
DROP POLICY IF EXISTS "services_insert" ON public.services;
DROP POLICY IF EXISTS "services_update" ON public.services;
DROP POLICY IF EXISTS "services_delete" ON public.services;

CREATE POLICY "services_insert" ON public.services AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_update" ON public.services AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_delete" ON public.services AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- pricing_plans
DROP POLICY IF EXISTS "pricing_insert" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_update" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_delete" ON public.pricing_plans;

CREATE POLICY "pricing_insert" ON public.pricing_plans AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "pricing_update" ON public.pricing_plans AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pricing_delete" ON public.pricing_plans AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- instructors
DROP POLICY IF EXISTS "instructors_insert" ON public.instructors;
DROP POLICY IF EXISTS "instructors_update" ON public.instructors;
DROP POLICY IF EXISTS "instructors_delete" ON public.instructors;

CREATE POLICY "instructors_insert" ON public.instructors AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "instructors_update" ON public.instructors AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "instructors_delete" ON public.instructors AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());

-- gallery_images
DROP POLICY IF EXISTS "gallery_insert" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_update" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_delete" ON public.gallery_images;

CREATE POLICY "gallery_insert" ON public.gallery_images AS PERMISSIVE FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "gallery_update" ON public.gallery_images AS PERMISSIVE FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery_delete" ON public.gallery_images AS PERMISSIVE FOR DELETE TO authenticated USING (public.is_admin());
