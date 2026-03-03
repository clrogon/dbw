export type NormalisedService = {
  slug: string;
  icon?: string;
  title?: string;
  shortDesc?: string;
};

// Normalises a CMS Service row or a fallback object to a stable internal shape
export const normaliseServiceRow = (s: any): NormalisedService => {
  if (!s) return { slug: "" } as NormalisedService;
  if (typeof s === "object" && s !== null) {
    const slug = s.slug ?? "";
    if ("short_desc" in s) {
      return {
        slug,
        icon: s.icon,
        title: s.title,
        shortDesc: s.short_desc,
      } as NormalisedService;
    }
    return {
      slug,
      icon: s.icon,
      title: s.title,
      shortDesc: s.shortDesc,
    } as NormalisedService;
  }
  return { slug: String(s) } as NormalisedService;
};

// Normalise a gallery image from CMS into a stable UI-friendly shape
export type NormalisedGalleryImage = {
  id?: string;
  src: string;
  alt: string;
  category: string;
};

export const normaliseGalleryImage = (img: any): NormalisedGalleryImage => {
  const id = img?.id ?? undefined;
  const src = img?.image_url ?? "";
  const alt = img?.alt ?? "";
  const category = img?.category ?? "";
  return { id, src, alt, category };
};

export type NormalisedInstructor = {
  id?: string;
  name?: string;
  role?: string;
  specialties?: string[];
  bio?: string;
  image_url?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export const normaliseInstructorRow = (instructor: any): NormalisedInstructor => {
  if (!instructor || typeof instructor !== "object") {
    return {
      id: "",
      name: "",
      role: "",
      specialties: [],
      bio: "",
      image_url: null,
      sort_order: 0,
      created_at: "",
      updated_at: "",
    };
  }
  return {
    id: instructor.id ?? "",
    name: instructor.name ?? "",
    role: instructor.role ?? "",
    specialties: Array.isArray(instructor.specialties) ? instructor.specialties : [],
    bio: instructor.bio ?? "",
    image_url: instructor.image_url ?? null,
    sort_order: typeof instructor.sort_order === "number" ? instructor.sort_order : 0,
    created_at: instructor.created_at ?? "",
    updated_at: instructor.updated_at ?? "",
  };
};
