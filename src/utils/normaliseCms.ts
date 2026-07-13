export type NormalisedService = {
  slug: string;
  icon?: string;
  title?: string;
  shortDesc?: string;
};

type ServiceLike = {
  slug?: string;
  icon?: string;
  title?: string;
  short_desc?: string;
  shortDesc?: string;
};

// Normalises a CMS Service row or a fallback object to a stable internal shape
export const normaliseServiceRow = (s: unknown): NormalisedService => {
  if (!s) return { slug: "" };
  if (typeof s === "object" && s !== null) {
    const row = s as ServiceLike;
    const slug = row.slug ?? "";
    if ("short_desc" in row) {
      return {
        slug,
        icon: row.icon,
        title: row.title,
        shortDesc: row.short_desc,
      };
    }
    return {
      slug,
      icon: row.icon,
      title: row.title,
      shortDesc: row.shortDesc,
    };
  }
  return { slug: String(s) };
};

// Normalise a gallery image from CMS into a stable UI-friendly shape
export type NormalisedGalleryImage = {
  id?: string;
  src: string;
  alt: string;
  category: string;
};

type GalleryLike = {
  id?: string;
  image_url?: string;
  alt?: string;
  category?: string;
};

export const normaliseGalleryImage = (img: unknown): NormalisedGalleryImage => {
  const row = (img ?? {}) as GalleryLike;
  return {
    id: row.id ?? undefined,
    src: row.image_url ?? "",
    alt: row.alt ?? "",
    category: row.category ?? "",
  };
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

type InstructorLike = {
  id?: string;
  name?: string;
  role?: string;
  specialties?: unknown;
  bio?: string;
  image_url?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export const normaliseInstructorRow = (instructor: unknown): NormalisedInstructor => {
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
  const row = instructor as InstructorLike;
  return {
    id: row.id ?? "",
    name: row.name ?? "",
    role: row.role ?? "",
    specialties: Array.isArray(row.specialties) ? (row.specialties as string[]) : [],
    bio: row.bio ?? "",
    image_url: row.image_url ?? null,
    sort_order: typeof row.sort_order === "number" ? row.sort_order : 0,
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
  };
};
