const fs = require('fs');
const path = require('path');

const dirs = [
  'admin',
  'super-admin',
  'provider',
  'finance',
  'operations',
  'support'
];

dirs.forEach(dirName => {
  const dirPath = path.join(__dirname, 'src/pages', dirName);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    
    if (content.includes("import Navbar") || content.includes("import Footer")) {
      content = content.replace(/import Navbar from '.*?';\n/g, '');
      content = content.replace(/import Footer from '.*?';\n/g, '');
      changed = true;
    }
    
    // Replace <Navbar /> and <Footer />
    if (content.includes('<Navbar />')) {
      content = content.replace(/<Navbar \/>\s*/g, '');
      changed = true;
    }
    if (content.includes('<Footer />')) {
      content = content.replace(/<Footer \/>\s*/g, '');
      changed = true;
    }
    
    // Replace <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
    if (content.includes('min-h-screen bg-slate-50')) {
      content = content.replace(/<div className="min-h-screen bg-slate-50 flex flex-col font-sans">\s*/g, '<>\n');
      content = content.replace(/<\/div>\s*$/g, '</>\n');
      changed = true;
    }
    
    // Remove <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10"> (or similar)
    if (content.includes('<main className="flex-grow max-w-7xl')) {
      content = content.replace(/<main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">\s*/g, '<div className="pb-10">\n');
      content = content.replace(/<\/main>\s*/g, '</div>\n');
      changed = true;
    } else if (content.includes('<main className="flex-grow p-4 sm:p-6 lg:p-8">')) {
      content = content.replace(/<main className="flex-grow p-4 sm:p-6 lg:p-8">\s*/g, '<div className="pb-10">\n');
      content = content.replace(/<\/main>\s*/g, '</div>\n');
      changed = true;
    }
    
    if (changed) {
      // Fix trailing closing div if we replaced it with </>
      // Oh wait, if there are multiple closing divs at the end, replace the last one.
      // My regex `<\/div>\s*$` will only match if it's the last thing before EOF, which might not be true if `);` is there.
      // So let's use a safer regex for the closing tag:
      content = content.replace(/<\/div>(\s*\)\s*;\s*};\s*export default)/, '</>$1');
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${file}`);
    }
  });
});
