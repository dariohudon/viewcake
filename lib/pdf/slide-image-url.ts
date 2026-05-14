/**
 * Converts a Slide.imagePath (e.g. "uploads/slides/<id>/slide-01.png")
 * to the public API URL served by the route handler.
 */
export function slideImageUrl(imagePath: string): string {
  return `/api/${imagePath}`;
}
