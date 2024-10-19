export function generateSlug(title: string, uniqueIdentifier: string = ''): string {
  // return title
  //   .toLowerCase()
  //   .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
  //   .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens

  if (uniqueIdentifier) {
    slug += `-${uniqueIdentifier}`;
  }

  return slug;
}
