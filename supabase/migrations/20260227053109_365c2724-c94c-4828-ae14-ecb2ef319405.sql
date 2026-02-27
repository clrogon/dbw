
-- Drop ALL existing policies on ALL CMS tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('user_roles','hero_content','services','pricing_plans','instructors','gallery_images')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- user_roles: authenticated users can read their own roles (PERMISSIVE)
CREATE POLICY "user_roles_select" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- hero_content
CREATE POLICY "hero_select" ON public.hero_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "hero_insert" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "hero_update" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "hero_delete" ON public.hero_content FOR DELETE TO authenticated USING (public.is_admin());

-- services
CREATE POLICY "services_select" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services_insert" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_update" ON public.services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_delete" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

-- pricing_plans
CREATE POLICY "pricing_select" ON public.pricing_plans FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "pricing_insert" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "pricing_update" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "pricing_delete" ON public.pricing_plans FOR DELETE TO authenticated USING (public.is_admin());

-- instructors
CREATE POLICY "instructors_select" ON public.instructors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "instructors_insert" ON public.instructors FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "instructors_update" ON public.instructors FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "instructors_delete" ON public.instructors FOR DELETE TO authenticated USING (public.is_admin());

-- gallery_images
CREATE POLICY "gallery_select" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery_insert" ON public.gallery_images FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "gallery_update" ON public.gallery_images FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "gallery_delete" ON public.gallery_images FOR DELETE TO authenticated USING (public.is_admin());
