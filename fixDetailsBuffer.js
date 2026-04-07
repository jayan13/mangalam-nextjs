const fs = require('fs');

function fixPage(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Add robust buffer decoder
  const decoderCode = `
function decodeBufferObj(val) {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (Buffer.isBuffer(val)) return val.toString('utf8');
  if (val.type === 'Buffer' && Array.isArray(val.data)) return Buffer.from(val.data).toString('utf8');
  return String(val);
}
`;

  if (!content.includes('function decodeBufferObj')) {
    // Insert decoder after imports (just before the first export or function)
    content = content.replace(/(?:\bexport\b|\bfunction\b)/, decoderCode + '\n$&');
  }

  // Find where news_details string is extracted:
  content = content.replace(
    /const detail = \(\(newses\[0\]\.news_details\) \? newses\[0\]\.news_details\.toString\(\) : \(newses\[0\]\.row_news_details \? newses\[0\]\.row_news_details\.toString\(\) : ''\)\)/g,
    'const detail = decodeBufferObj(newses[0].news_details || newses[0].row_news_details || "")'
  );

  content = content.replace(
    /let ndet = \(newses\[0\]\.news_details\) \? newses\[0\]\.news_details\.toString\(\) : \(newses\[0\]\.row_news_details \? newses\[0\]\.row_news_details\.toString\(\) : ''\);/g,
    'let ndet = decodeBufferObj(newses[0].news_details || newses[0].row_news_details || "");'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
}

fixPage('src/app/news/detail/[...slug]/page.js');
fixPage('src/app/en-news/detail/[...slug]/page.js');
