
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- user_roles
DROP POLICY IF EXISTS "user_roles_select" ON public.user_roles;
CREATE POLICY "user_roles_select" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- hero_content
DROP POLICY IF EXISTS "hero_select" ON public.hero_content;
DROP POLICY IF EXISTS "hero_insert" ON public.hero_content;
DROP POLICY IF EXISTS "hero_update" ON public.hero_content;
DROP POLICY IF EXISTS "hero_delete" ON public.hero_content;
CREATE POLICY "hero_select" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "hero_insert" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "hero_update" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "hero_delete" ON public.hero_content FOR DELETE TO authenticated USING (public.is_admin());

-- services
DROP POLICY IF EXISTS "services_select" ON public.services;
DROP POLICY IF EXISTS "services_insert" ON public.services;
DROP POLICY IF EXISTS "services_update" ON public.services;
DROP POLICY IF EXISTS "services_delete" ON public.services;
CREATE POLICY "services_select" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_insert" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_update" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_delete" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- pricing_plans
DROP POLICY IF EXISTS "pricing_select" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_insert" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_update" ON public.pricing_plans;
DROP POLICY IF EXISTS "pricing_delete" ON public.pricing_plans;
CREATE POLICY "pricing_select" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "pricing_insert" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "pricing_update" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pricing_delete" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_admin());

-- instructors
DROP POLICY IF EXISTS "instructors_select" ON public.instructors;
DROP POLICY IF EXISTS "instructors_insert" ON public.instructors;
DROP POLICY IF EXISTS "instructors_update" ON public.instructors;
DROP POLICY IF EXISTS "instructors_delete" ON public.instructors;
CREATE POLICY "instructors_select" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "instructors_insert" ON public.instructors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "instructors_update" ON public.instructors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "instructors_delete" ON public.instructors FOR DELETE TO authenticated USING (public.is_admin());

-- gallery_images
DROP POLICY IF EXISTS "gallery_select" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_insert" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_update" ON public.gallery_images;
DROP POLICY IF EXISTS "gallery_delete" ON public.gallery_images;
CREATE POLICY "gallery_select" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery_insert" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "gallery_update" ON public.gallery_images FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery_delete" ON public.gallery_images FOR DELETE TO authenticated USING (public.is_admin());
