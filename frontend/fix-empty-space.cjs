const fs = require('fs');
const path = require('path');

// 1. Update index.css body background
const cssPath = path.join(__dirname, 'src/index.css');
let cssContent = fs.readFileSync(cssPath, 'utf-8');
cssContent = cssContent.replace(/background-color: #f8fafc;/g, 'background-color: #020617; /* slate-950 to blend with footer */');
fs.writeFileSync(cssPath, cssContent);

// 2. Remove min-h-screen and flex-grow from all relevant files
const dirsToScan = [
  'src/components',
  'src/pages',
  'src/pages/booking',
  'src/pages/customer',
  'src/pages/auth'
];

dirsToScan.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.jsx'));
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;
    
    // Replace <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
    // with <div className="bg-slate-50 flex flex-col font-sans min-h-[100vh]"> NO!
    // We want to remove min-h-screen completely so it doesn't force a gap.
    if (content.includes('min-h-screen')) {
      content = content.replace(/min-h-screen\s+/g, '');
      content = content.replace(/className="min-h-screen"/g, 'className=""');
      changed = true;
    }
    
    // Remove flex-grow from the main container
    if (content.includes('flex-grow max-w-7xl')) {
      content = content.replace(/flex-grow\s+/g, '');
      changed = true;
    } else if (content.includes('<main className="flex-grow')) {
      content = content.replace(/<main className="flex-grow/g, '<main className="');
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${file}`);
    }
  });
});
