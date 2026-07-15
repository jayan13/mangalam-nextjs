export function parseNewsContent(html, images = []) {
  if (!html) return [];

  // Remove social widget scripts
  html = html
    .replace(
      /<script[^>]*src=["'](?:https?:)?\/\/platform\.(?:twitter|x)\.com\/widgets\.js[^>]*><\/script>/gi,
      ""
    )
    .replace(
      /<script[^>]*src=["'](?:https?:)?\/\/(?:www\.)?instagram\.com\/embed\.js[^>]*><\/script>/gi,
      ""
    );

  const tokens = [];
  let imageIndex = 0;

  // Matches:
  // [IMG]
  // Twitter blockquote
  // Instagram blockquote
  // iframe (YouTube etc.)
  const regex =
    /(\[IMG\])|(<blockquote\b[^>]*class=["'][^"']*(?:twitter-tweet|instagram-media)[^"']*["'][\s\S]*?<\/blockquote>)|(<iframe[\s\S]*?<\/iframe>)/gi;

  let last = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {

    const before = html.substring(last, match.index);

    if (before.trim()) {
      tokens.push({
        type: "html",
        html: before
      });
    }

    if (match[1]) {
      // [IMG]

      if (images[imageIndex]) {
        tokens.push({
          type: "image",
          image: images[imageIndex]
        });
      }

      imageIndex++;

    } else if (match[2]) {

      if (match[2].includes("twitter-tweet")) {
        tokens.push({
          type: "twitter",
          html: match[2]
        });
      } else {
        tokens.push({
          type: "instagram",
          html: match[2]
        });
      }

    } else if (match[3]) {

      tokens.push({
        type: "youtube",
        html: match[3]
      });

    }

    last = regex.lastIndex;
  }

  const remain = html.substring(last);

  if (remain.trim()) {
    tokens.push({
      type: "html",
      html: remain
    });
  }

  return tokens;
}