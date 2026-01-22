export const whatsappUrl = 'https://wa.me/330759652867';
export const homeMotoImage = '/images/tmax1.jpeg';
export const homeMotoLink = 'https://lesbikeuses.fr/lxs-125-lexmoto/';
export const facebookDeepLink = (webUrl: string) =>
  `fb://facewebmodal/f?href=${encodeURIComponent(webUrl)}`;
export function openFacebook(webUrl: string) {
  const usernameMatch = webUrl.match(/facebook\.com\/([^/?#]+)/i);
  const username = usernameMatch ? usernameMatch[1] : undefined;
  const attempts: string[] = [];
  if (username) {
    attempts.push(`fb://page/${username}`);
    attempts.push(`fb://profile/${username}`);
  }
  attempts.push(facebookDeepLink(webUrl));
  const start = Date.now();
  const tryNext = () => {
    const next = attempts.shift();
    if (!next) {
      window.open(webUrl, '_blank');
      return;
    }
    window.location.href = next;
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        tryNext();
      }
    }, 600);
  };
  try {
    tryNext();
  } catch {
    window.open(webUrl, '_blank');
  }
}
