import {
  galleryCategories,
  type GalleryCategory,
  type GalleryFilter,
} from './gallery-categories';

type GalleryHistoryTarget = Pick<Window, 'location' | 'history'>;
type GalleryPopstateTarget = Pick<Window, 'location' | 'addEventListener' | 'removeEventListener'>;

export function getGalleryFilterFromUrl(search: string = window.location.search): GalleryFilter {
  const value = new URLSearchParams(search).get('category');
  return value && galleryCategories.includes(value as GalleryCategory)
    ? value as GalleryCategory
    : 'all';
}

export function updateGalleryFilterHistory(
  filter: GalleryFilter,
  target: GalleryHistoryTarget = window,
): void {
  const url = new URL(target.location.href);
  if (filter === 'all') {
    url.searchParams.delete('category');
  } else {
    url.searchParams.set('category', filter);
  }
  target.history.pushState(target.history.state, '', `${url.pathname}${url.search}${url.hash}`);
}

export function listenForGalleryFilterHistory(
  target: GalleryPopstateTarget,
  onFilterChange: (filter: GalleryFilter) => void,
): () => void {
  const syncFilterFromUrl = () => onFilterChange(getGalleryFilterFromUrl(target.location.search));
  target.addEventListener('popstate', syncFilterFromUrl);
  return () => target.removeEventListener('popstate', syncFilterFromUrl);
}
