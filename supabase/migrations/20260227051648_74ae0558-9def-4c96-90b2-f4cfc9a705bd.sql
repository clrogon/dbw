
-- =============================================
-- FIX: Drop ALL restrictive policies and recreate as PERMISSIVE
-- This is the ROOT CAUSE: restrictive policies block everything
-- =============================================

-- 1. user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles " ON public.user_roles;
CREATE POLICY "users_read_own_roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. hero_content
DROP POLICY IF EXISTS "Public can read hero" ON public.hero_content;
DROP POLICY IF EXISTS "Public can read hero " ON public.hero_content;
DROP POLICY IF EXISTS "Admins can insert hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can insert hero " ON public.hero_content;
DROP POLICY IF EXISTS "Admins can update hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can update hero " ON public.hero_content;
DROP POLICY IF EXISTS "Admins can delete hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can delete hero " ON public.hero_content;

CREATE POLICY "hero_public_read" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "hero_admin_insert" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "hero_admin_update" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "hero_admin_delete" ON public.hero_content FOR DELETE TO authenticated USING (public.is_admin());

-- 3. services
DROP POLICY IF EXISTS "Public can read services" ON public.services;
DROP POLICY IF EXISTS "Public can read services " ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services " ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services " ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services " ON public.services;

CREATE POLICY "services_public_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_admin_insert" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_admin_update" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_admin_delete" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- 4. pricing_plans
DROP POLICY IF EXISTS "Public can read pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Public can read pricing " ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can insert pricing " ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can update pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can update pricing " ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can delete pricing " ON public.pricing_plans;

CREATE POLICY "pricing_public_read" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "pricing_admin_insert" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "pricing_admin_update" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pricing_admin_delete" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_admin());

-- 5. instructors
DROP POLICY IF EXISTS "Public can read instructors" ON public.instructors;
DROP POLICY IF EXISTS "Public can read instructors " ON public.instructors;
DROP POLICY IF EXISTS "Admins can insert instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can insert instructors " ON public.instructors;
DROP POLICY IF EXISTS "Admins can update instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can update instructors " ON public.instructors;
DROP POLICY IF EXISTS "Admins can delete instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can delete instructors " ON public.instructors;

CREATE POLICY "instructors_public_read" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "instructors_admin_insert" ON public.instructors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "instructors_admin_update" ON public.instructors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "instructors_admin_delete" ON public.instructors FOR DELETE TO authenticated USING (public.is_admin());

-- 6. gallery_images
DROP POLICY IF EXISTS "Public can read gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Public can read gallery " ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery " ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery " ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery " ON public.gallery_images;

CREATE POLICY "gallery_public_read" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "gallery_admin_insert" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "gallery_admin_update" ON public.gallery_images FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery_admin_delete" ON public.gallery_images FOR DELETE TO authenticated USING (public.is_admin());
