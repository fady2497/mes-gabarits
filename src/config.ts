export const whatsappUrl = 'https://wa.me/330759652867';
export const homeMotoImage = '/images/tmax1.jpeg';
export const homeMotoLink = 'https://lesbikeuses.fr/lxs-125-lexmoto/';
export const facebookDeepLink = (webUrl: string) =>
  `fb://facewebmodal/f?href=${encodeURIComponent(webUrl)}`;
export function openFacebook(webUrl: string) {
  const deep = facebookDeepLink(webUrl);
  try {
    const start = Date.now();
    window.location.href = deep;
    setTimeout(() => {
      if (Date.now() - start < 1800) {
        window.open(webUrl, '_blank');
      }
    }, 1200);
  } catch {
    window.open(webUrl, '_blank');
  }
}
