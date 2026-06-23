// Real food photography via Unsplash CDN. The `photo` field on each item/
// restaurant is a verified Unsplash photo id, so images load fast and crisp.

export function foodImg(photo: string, _id: string, w = 400, h = 400): string {
  return `https://images.unsplash.com/photo-${photo}?w=${w}&h=${h}&q=72&auto=format&fit=crop`;
}
