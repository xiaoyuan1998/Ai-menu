import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
  fetch: nodeFetch as any,
});

export async function searchFoodImage(searchTerms: string) {
  try {
    const result = await unsplash.search.getPhotos({
      query: searchTerms,
      perPage: 1,
      orientation: 'landscape',
      contentFilter: 'high',
      orderBy: 'relevant'
    });

    if (result.errors || !result.response) {
      console.error('Unsplash API error:', result.errors);
      return null;
    }

    const photo = result.response.results[0];
    if (!photo) {
      return null;
    }

    return {
      url: photo.urls.regular,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html,
      },
    };
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}
