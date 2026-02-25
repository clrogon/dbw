
-- Drop all restrictive policies and recreate as permissive

-- user_roles
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- gallery_images
DROP POLICY IF EXISTS "Public can read gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery" ON public.gallery_images;
CREATE POLICY "Public can read gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update gallery" ON public.gallery_images FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete gallery" ON public.gallery_images FOR DELETE TO authenticated USING (public.is_admin());

-- hero_content
DROP POLICY IF EXISTS "Public can read hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can insert hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can update hero" ON public.hero_content;
DROP POLICY IF EXISTS "Admins can delete hero" ON public.hero_content;
CREATE POLICY "Public can read hero" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Admins can insert hero" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update hero" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete hero" ON public.hero_content FOR DELETE TO authenticated USING (public.is_admin());

-- instructors
DROP POLICY IF EXISTS "Public can read instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can insert instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can update instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admins can delete instructors" ON public.instructors;
CREATE POLICY "Public can read instructors" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "Admins can insert instructors" ON public.instructors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update instructors" ON public.instructors FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete instructors" ON public.instructors FOR DELETE TO authenticated USING (public.is_admin());

-- pricing_plans
DROP POLICY IF EXISTS "Public can read pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can insert pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can update pricing" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can delete pricing" ON public.pricing_plans;
CREATE POLICY "Public can read pricing" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Admins can insert pricing" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update pricing" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete pricing" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_admin());

-- services
DROP POLICY IF EXISTS "Public can read services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
CREATE POLICY "Public can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.is_admin());
