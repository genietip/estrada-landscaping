import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  filterGalleryPhotos,
  galleryCategories,
  galleryFilterLabels,
  getGalleryPhotoCategory,
  type GalleryPhotoDescription,
} from './gallery-categories';
import {
  getGalleryFilterFromUrl,
  listenForGalleryFilterHistory,
  updateGalleryFilterHistory,
} from './gallery-url';

// Keep the regression snapshot tied to the photo descriptions rendered by the gallery.
const appSource = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8');
const arrayStart = appSource.indexOf('const galleryPhotos = [');
assert.notEqual(arrayStart, -1, 'App.tsx should define the gallery photo set');
const literalStart = appSource.indexOf('[', arrayStart);
const literalEnd = appSource.indexOf('\n];', literalStart) + 2;
assert.ok(literalEnd > literalStart, 'gallery photo data should be a complete array');
const galleryPhotos = new Function(`return ${appSource.slice(literalStart, literalEnd)}`)() as GalleryPhotoDescription[];

test('every gallery photo points to an existing public image file', () => {
  const galleryDirectory = new URL('../../public/gallery/', import.meta.url);
  const missingFiles = galleryPhotos
    .filter((photo) => !existsSync(new URL(photo.file, galleryDirectory)))
    .map((photo) => photo.file);

  assert.equal(
    missingFiles.length,
    0,
    `Missing gallery image file(s): ${missingFiles.join(', ')}`,
  );
});

test('every referenced gallery image can be decoded', () => {
  try {
    execFileSync('magick', ['-version'], { stdio: 'ignore' });
  } catch {
    assert.fail('ImageMagick (magick) must be available to run gallery image checks');
  }

  const galleryDirectory = new URL('../../public/gallery/', import.meta.url);
  const imageFiles = galleryPhotos.map((photo) => ({
    file: photo.file,
    path: fileURLToPath(new URL(photo.file, galleryDirectory)),
  }));
  const findUnreadableFiles = (files: typeof imageFiles): string[] => {
    if (files.length === 0) return [];

    try {
      execFileSync(
        'magick',
        [...files.map((file) => file.path), '-regard-warnings', 'null:'],
        { stdio: 'ignore' },
      );
      return [];
    } catch {
      if (files.length === 1) return [files[0].file];
      const middle = Math.floor(files.length / 2);
      return [
        ...findUnreadableFiles(files.slice(0, middle)),
        ...findUnreadableFiles(files.slice(middle)),
      ];
    }
  };
  const unreadableFiles = findUnreadableFiles(imageFiles);

  assert.deepEqual(
    unreadableFiles,
    [],
    `Unreadable gallery image file(s): ${unreadableFiles.join(', ')}`,
  );
});

test('every local About story photo points to an existing public image file', () => {
  const aboutStart = appSource.indexOf('function About() {');
  assert.notEqual(aboutStart, -1, 'App.tsx should define the About page');
  const collageStart = appSource.indexOf('<div className="story-photo-collage"', aboutStart);
  assert.notEqual(collageStart, -1, 'About page should define its story photo collage');
  const storyCopyStart = appSource.indexOf('<div className="story-copy">', collageStart);
  assert.notEqual(storyCopyStart, -1, 'About story collage should appear before its story copy');

  const collageMarkup = appSource.slice(collageStart, storyCopyStart);
  const aboutPhotoFiles = [...collageMarkup.matchAll(/about\/([^`'"]+\.(?:avif|gif|jpe?g|png|webp))/gi)]
    .map(([, file]) => file);
  assert.ok(aboutPhotoFiles.length > 0, 'About story collage should reference local photo files');

  const aboutDirectory = new URL('../../public/about/', import.meta.url);
  const missingFiles = aboutPhotoFiles
    .filter((file) => !existsSync(new URL(file, aboutDirectory)));

  assert.equal(
    missingFiles.length,
    0,
    `Missing About story image file(s): ${missingFiles.join(', ')}`,
  );
});

const categorizedPhotos = galleryPhotos.map((photo) => ({
  ...photo,
  category: getGalleryPhotoCategory(photo),
}));

test('unmatched photos are flagged and remain visible in All projects only', () => {
  const photo = {
    file: 'needs-review.jpg',
    label: { en: 'Outdoor project', es: 'Proyecto exterior' },
    alt: { en: 'Home improvement work in progress', es: 'Mejoras en el hogar en proceso' },
  };
  const photoWithCategory = { ...photo, category: getGalleryPhotoCategory(photo) };

  assert.equal(photoWithCategory.category, null);
  assert.deepEqual(filterGalleryPhotos([photoWithCategory], 'all'), [photoWithCategory]);
  for (const category of galleryCategories) {
    assert.deepEqual(filterGalleryPhotos([photoWithCategory], category), []);
  }
});

test('every current gallery photo has an intentional category', () => {
  const photosNeedingReview = categorizedPhotos
    .filter((photo) => photo.category === null)
    .map((photo) => photo.file);

  assert.deepEqual(
    photosNeedingReview,
    [],
    `Photos need category review: ${photosNeedingReview.join(', ')}`,
  );
});

const expectedFiles: Record<(typeof galleryCategories)[number], string[]> = {
  lawn: [
    'estrada-01.jpg', 'estrada-20.jpg', 'estrada-22.jpg', 'estrada-28.jpg',
    'estrada-29.jpg', 'estrada-81.jpg', 'estrada-83.jpg', 'estrada-84.jpg',
    'estrada-87.jpg', 'estrada-88.jpg',
  ],
  planting: [
    'estrada-24.jpg', 'estrada-25.jpg', 'estrada-30.jpg', 'estrada-31.jpg',
    'estrada-32.jpg', 'estrada-45.jpg', 'estrada-69.jpg', 'estrada-80.jpg',
    'estrada-82.jpg', 'estrada-86.jpg', 'estrada-90.jpg', 'estrada-91.jpg',
  ],
  walkways: [
    'estrada-02.jpg', 'estrada-03.jpg', 'estrada-06.jpg', 'estrada-09.jpg',
    'estrada-10.jpg', 'estrada-21.jpg', 'estrada-23.jpg', 'estrada-26.jpg',
    'estrada-27.jpg', 'estrada-35.jpg', 'estrada-36.jpg', 'estrada-38.jpg',
    'estrada-41.jpg', 'estrada-42.jpg', 'estrada-44.jpg', 'estrada-48.jpg',
    'estrada-54.jpg', 'estrada-55.jpg', 'estrada-56.jpg', 'estrada-57.jpg',
    'estrada-61.jpg', 'estrada-62.jpg', 'estrada-64.jpg', 'estrada-66.jpg',
    'estrada-67.jpg', 'estrada-68.jpg', 'estrada-70.jpg', 'estrada-71.jpg',
    'estrada-75.jpg', 'estrada-76.jpg', 'estrada-77.jpg', 'estrada-78.jpg',
    'estrada-79.jpg', 'estrada-85.jpg',
  ],
  stonework: [
    'estrada-04.jpg', 'estrada-05.jpg', 'estrada-07.jpg', 'estrada-08.jpg',
    'estrada-11.jpg', 'estrada-12.jpg', 'estrada-13.jpg', 'estrada-14.jpg',
    'estrada-15.jpg', 'estrada-16.jpg', 'estrada-17.jpg', 'estrada-18.jpg',
    'estrada-19.jpg', 'estrada-33.jpg', 'estrada-34.jpg', 'estrada-37.jpg', 'estrada-39.jpg',
    'estrada-40.jpg', 'estrada-43.jpg', 'estrada-46.jpg', 'estrada-47.jpg',
    'estrada-49.jpg', 'estrada-50.jpg', 'estrada-51.jpg', 'estrada-52.jpg',
    'estrada-53.jpg', 'estrada-58.jpg', 'estrada-59.jpg', 'estrada-60.jpg',
    'estrada-63.jpg', 'estrada-65.jpg', 'estrada-72.jpg', 'estrada-73.jpg', 'estrada-74.jpg',
    'estrada-89.jpg', 'estrada-92.jpg', 'estrada-93.jpg',
  ],
};

test('assigns every current gallery photo to its expected category', () => {
  const actualFiles = Object.fromEntries(
    galleryCategories.map((category) => [
      category,
      categorizedPhotos.filter((photo) => photo.category === category).map((photo) => photo.file),
    ]),
  );

  assert.equal(galleryPhotos.length, 93);
  assert.deepEqual(actualFiles, expectedFiles);
});

for (const category of galleryCategories) {
  test(`the ${category} filter shows only its expected projects`, () => {
    assert.deepEqual(
      filterGalleryPhotos(categorizedPhotos, category).map((photo) => photo.file),
      expectedFiles[category],
    );
  });
}

test('All and reset restore the complete gallery in its original order', () => {
  const allFiles = galleryPhotos.map((photo) => photo.file);
  const narrowedResults = filterGalleryPhotos(categorizedPhotos, 'planting');

  assert.notEqual(narrowedResults.length, allFiles.length);
  assert.deepEqual(narrowedResults.map((photo) => photo.file), expectedFiles.planting);
  assert.deepEqual(filterGalleryPhotos(categorizedPhotos, 'all').map((photo) => photo.file), allFiles);
});

test('filter labels are correct in English and Spanish', () => {
  assert.deepEqual(galleryFilterLabels.en, {
    all: 'All projects',
    lawn: 'Lawn & yard care',
    planting: 'Planting & gardens',
    walkways: 'Walkways & patios',
    stonework: 'Stonework',
  });
  assert.deepEqual(galleryFilterLabels.es, {
    all: 'Todos los proyectos',
    lawn: 'Césped y cuidado del jardín',
    planting: 'Plantación y jardines',
    walkways: 'Senderos y patios',
    stonework: 'Mampostería',
  });
});

for (const category of galleryCategories) {
  test(`a direct ${category} URL restores its filter after reload`, () => {
    const search = `?campaign=spring&category=${category}`;

    assert.equal(getGalleryFilterFromUrl(search), category);
    assert.equal(getGalleryFilterFromUrl(search), category);
  });
}

test('missing or unsupported category values restore All projects', () => {
  assert.equal(getGalleryFilterFromUrl(''), 'all');
  assert.equal(getGalleryFilterFromUrl('?category=unknown'), 'all');
  assert.equal(getGalleryFilterFromUrl('?category=All%20projects'), 'all');
});

test('selecting a category updates the URL and All removes only that parameter', () => {
  const harness = new GalleryHistoryHarness('https://example.com/gallery?campaign=spring#projects');

  updateGalleryFilterHistory('planting', harness.target);
  assert.equal(harness.currentUrl, 'https://example.com/gallery?campaign=spring&category=planting#projects');
  assert.equal(getGalleryFilterFromUrl(harness.search), 'planting');

  updateGalleryFilterHistory('all', harness.target);
  assert.equal(harness.currentUrl, 'https://example.com/gallery?campaign=spring#projects');
  assert.equal(getGalleryFilterFromUrl(harness.search), 'all');
});

test('back and forward restore filters from the browser history', () => {
  const harness = new GalleryHistoryHarness('https://example.com/gallery');
  const changes: string[] = [];
  const unsubscribe = listenForGalleryFilterHistory(harness.popstateTarget, (filter) => changes.push(filter));

  updateGalleryFilterHistory('lawn', harness.target);
  updateGalleryFilterHistory('stonework', harness.target);
  harness.back();
  harness.back();
  harness.forward();
  harness.forward();
  unsubscribe();

  assert.deepEqual(changes, ['lawn', 'all', 'lawn', 'stonework']);
});

test('English and Spanish labels stay paired with their filtered projects', () => {
  const filteredProjects = filterGalleryPhotos(categorizedPhotos, 'planting');

  assert.ok(filteredProjects.length > 0);
  assert.ok(filteredProjects.every((photo) => photo.category === 'planting'));
  assert.equal(galleryFilterLabels.en.planting, 'Planting & gardens');
  assert.equal(galleryFilterLabels.es.planting, 'Plantación y jardines');
  assert.equal(galleryFilterLabels.en.all, 'All projects');
  assert.equal(galleryFilterLabels.es.all, 'Todos los proyectos');
});

class GalleryHistoryHarness {
  private entries: string[];
  private index = 0;
  private listeners = new Set<EventListener>();

  readonly target: Parameters<typeof updateGalleryFilterHistory>[1];
  readonly popstateTarget: Parameters<typeof listenForGalleryFilterHistory>[0];

  constructor(initialUrl: string) {
    this.entries = [initialUrl];
    const location = {
      get href() {
        return harness.currentUrl;
      },
      get search() {
        return new URL(harness.currentUrl).search;
      },
    };
    const harness = this;
    const history = {
      state: null,
      pushState(_state: unknown, _unused: string, url?: string | URL | null) {
        if (url !== undefined && url !== null) {
          harness.entries = harness.entries.slice(0, harness.index + 1);
          harness.entries.push(new URL(url.toString(), harness.currentUrl).href);
          harness.index += 1;
        }
      },
    };
    const eventTarget = {
      location,
      addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        if (type === 'popstate') harness.listeners.add(listener as EventListener);
      },
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        if (type === 'popstate') harness.listeners.delete(listener as EventListener);
      },
    };

    this.target = { location, history } as unknown as Parameters<typeof updateGalleryFilterHistory>[1];
    this.popstateTarget = eventTarget as unknown as Parameters<typeof listenForGalleryFilterHistory>[0];
  }

  get currentUrl(): string {
    return this.entries[this.index];
  }

  get search(): string {
    return new URL(this.currentUrl).search;
  }

  back(): void {
    this.move(-1);
  }

  forward(): void {
    this.move(1);
  }

  private move(delta: number): void {
    const nextIndex = this.index + delta;
    if (nextIndex < 0 || nextIndex >= this.entries.length) return;
    this.index = nextIndex;
    for (const listener of this.listeners) listener(new Event('popstate'));
  }
}
