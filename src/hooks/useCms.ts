import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];
type Instructor = Database["public"]["Tables"]["instructors"]["Row"];
type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];

type CmsQueryOptions = {
  staleTime: number;
  gcTime: number;
  retry: number;
  refetchOnWindowFocus: boolean;
};

const cmsQueryOptions: CmsQueryOptions = {
  staleTime: 30_000,
  gcTime: 300_000,
  retry: 1,
  refetchOnWindowFocus: true,
};

export const useHeroContent = () =>
  useQuery({
    queryKey: ["hero_content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero_content").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
    ...cmsQueryOptions,
  });

export const useCmsServices = () =>
  useQuery({
    queryKey: ["cms_services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Service[];
    },
    ...cmsQueryOptions,
  });

export const useCmsService = (slug: string) =>
  useQuery({
    queryKey: ["cms_service", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    ...cmsQueryOptions,
  });

export const usePricingPlans = () =>
  useQuery({
    queryKey: ["pricing_plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_plans").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as PricingPlan[];
    },
    ...cmsQueryOptions,
  });

export const useCmsInstructors = () =>
  useQuery({
    queryKey: ["cms_instructors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("instructors").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as Instructor[];
    },
    ...cmsQueryOptions,
  });

export const useCmsGallery = () =>
  useQuery({
    queryKey: ["cms_gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_images").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as GalleryImage[];
    },
    ...cmsQueryOptions,
  });
