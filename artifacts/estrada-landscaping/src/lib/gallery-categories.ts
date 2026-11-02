export const galleryCategories = ['lawn', 'planting', 'walkways', 'stonework'] as const;

export type GalleryCategory = (typeof galleryCategories)[number];
export type GalleryFilter = 'all' | GalleryCategory;

export type GalleryPhotoDescription = {
  file: string;
  label: { en: string; es: string };
  alt: { en: string; es: string };
};

export type CategorizedGalleryPhoto = GalleryPhotoDescription & {
  category: GalleryCategory | null;
};

export const galleryFilterLabels = {
  en: {
    all: 'All projects',
    lawn: 'Lawn & yard care',
    planting: 'Planting & gardens',
    walkways: 'Walkways & patios',
    stonework: 'Stonework',
  },
  es: {
    all: 'Todos los proyectos',
    lawn: 'Césped y cuidado del jardín',
    planting: 'Plantación y jardines',
    walkways: 'Senderos y patios',
    stonework: 'Mampostería',
  },
} as const satisfies Record<'en' | 'es', Record<GalleryFilter, string>>;

const galleryCategoryPatterns: Record<GalleryCategory, RegExp> = {
  stonework: /\b(?:masonry|fireplace|fire pit|fire feature|chimney|retaining wall|outdoor kitchen|oven|stonework|stone feature|stone wall|block wall|grill|kitchen island)\b/i,
  walkways: /\b(?:walkway|path|paver|paving|paved|patio|driveway|steps?|flagstone)\b/i,
  lawn: /\b(?:lawn|mow(?:ed|ing)?|grass|turf|yard work|yard care|yard clean-?up|tree removal|tree pruning|brush clearing|drainage|site preparation|loader|equipment)\b/i,
  planting: /\b(?:planting|plants?|garden|shrubs?|mulch|flowers?|bed|edging|border|landscap|fence)\b/i,
};

const categoryRulePriority: GalleryCategory[] = ['stonework', 'walkways', 'lawn', 'planting'];

export function getGalleryPhotoCategory(photo: GalleryPhotoDescription): GalleryCategory | null {
  for (const text of [photo.label.en, photo.alt.en]) {
    const category = categoryRulePriority.find((candidate) => galleryCategoryPatterns[candidate].test(text));
    if (category) return category;
  }
  return null;
}

export function filterGalleryPhotos<T extends CategorizedGalleryPhoto>(
  photos: readonly T[],
  filter: GalleryFilter,
): T[] {
  return filter === 'all' ? [...photos] : photos.filter((photo) => photo.category === filter);
}
