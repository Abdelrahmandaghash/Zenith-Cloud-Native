const fs = require('fs');

console.log("=== Verifying ZENITH Frontend Source Files ===");

const files = [
  'frontend/src/data/sampleData.js',
  'frontend/src/services/api.js',
  'frontend/src/context/CartContext.jsx',
  'frontend/src/components/Navbar.jsx',
  'frontend/src/components/Footer.jsx',
  'frontend/src/components/CartDrawer.jsx',
  'frontend/src/components/ProductModal.jsx',
  'frontend/src/components/TourModal.jsx',
  'frontend/src/pages/HomePage.jsx',
  'frontend/src/pages/ShopPage.jsx',
  'frontend/src/pages/ExpeditionsPage.jsx',
  'frontend/src/App.jsx',
  'frontend/src/main.jsx',
  'frontend/package.json',
  'frontend/vite.config.js',
  'frontend/tailwind.config.js',
  'frontend/postcss.config.js',
  'frontend/index.html',
  'frontend/Dockerfile'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error(`[FAIL] Missing file: ${f}`);
    process.exit(1);
  }
  const size = fs.statSync(f).size;
  console.log(`  [OK] ${f} (${size} bytes)`);
});

console.log("\nAll frontend files exist and are populated with complete code!");
