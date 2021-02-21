export const avatarImages = importAll(require.context('../assets/images/avatars', false, /\.jpg|png$/));

function importAll(r: any) {
  let images: {[index: string]: string} = {};
  r.keys().forEach((item: any) => { images[item.replace('./', '')] = r(item).default; });
  return images;
}
  