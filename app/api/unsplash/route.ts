import { createApi } from 'unsplash-js';
import { NextResponse } from 'next/server';
import nodeFetch from 'node-fetch';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
  fetch: nodeFetch as any,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const result = await unsplash.search.getPhotos({
      query: `${query} food chinese cuisine`,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.errors) {
      return NextResponse.json({ error: result.errors[0] }, { status: 500 });
    }

    const photo = result.response?.results[0];
    if (!photo) {
      return NextResponse.json({ error: 'No photos found' }, { status: 404 });
    }

    return NextResponse.json({
      url: photo.urls.regular,
      credit: {
        name: photo.user.name,
        link: photo.user.links.html,
      },
    });
  } catch (error) {
    console.error('Unsplash API error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
