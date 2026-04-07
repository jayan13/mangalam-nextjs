const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.js');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Add the Buffer toString fix right at the start of SubstringWithoutBreakingWords
  const functionRegex = /function\s+SubstringWithoutBreakingWords\s*\(\s*str\s*,\s*limit\s*\)\s*\{/g;
  
  if (functionRegex.test(content)) {
    // Only replace if not already fixed
    if (!content.includes('if (Buffer.isBuffer(str))')) {
      newContent = content.replace(
        /function\s+SubstringWithoutBreakingWords\s*\(\s*str\s*,\s*limit\s*\)\s*\{/,
        'function SubstringWithoutBreakingWords(str, limit) {\n  if (Buffer.isBuffer(str)) str = str.toString(\"utf8\");\n  if (typeof str !== \"string\") str = String(str || \"\");'
      );
      fs.writeFileSync(file, newContent, 'utf8');
      console.log('Fixed', file);
    }
  }
});
