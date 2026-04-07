const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.js');
let count = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/CONVERT\(news\.news_details USING utf8\)\s+[aA][sS]\s+[\"']?news_details[\"']?/g, 'news.news_details');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
    count++;
  }
});
console.log('Done, updated: ' + count + ' files.');
