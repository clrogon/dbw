import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];
type Instructor = Database["public"]["Tables"]["instructors"]["Row"];
type GalleryImage = Database["public"]["Tables"]["gallery_images"]["Row"];
type HeroContent = Database["public"]["Tables"]["hero_content"]["Row"];

export const useHeroContent = () =>
  useQuery({
    queryKey: ["hero_content"],
    queryFn: async () => {
      const { data } = await supabase.from("hero_content").select("*").limit(1).single();
      return data;
    },
  });

export const useCmsServices = () =>
  useQuery({
    queryKey: ["cms_services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").order("sort_order");
      return (data ?? []) as Service[];
    },
  });

export const useCmsService = (slug: string) =>
  useQuery({
    queryKey: ["cms_service", slug],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("slug", slug).single();
      return data;
    },
    enabled: !!slug,
  });

export const usePricingPlans = () =>
  useQuery({
    queryKey: ["pricing_plans"],
    queryFn: async () => {
      const { data } = await supabase.from("pricing_plans").select("*").order("sort_order");
      return (data ?? []) as PricingPlan[];
    },
  });

export const useCmsInstructors = () =>
  useQuery({
    queryKey: ["cms_instructors"],
    queryFn: async () => {
      const { data } = await supabase.from("instructors").select("*").order("sort_order");
      return (data ?? []) as Instructor[];
    },
  });

export const useCmsGallery = () =>
  useQuery({
    queryKey: ["cms_gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("sort_order");
      return (data ?? []) as GalleryImage[];
    },
  });
