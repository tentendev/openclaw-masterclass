/**
 * Post-build script: nests build output under /openclaw/ subdirectory.
 *
 * Docusaurus with baseUrl: '/openclaw/' generates HTML that references
 * /openclaw/assets/..., but outputs files to build/ root. This script
 * moves everything into build/openclaw/ so the file paths match the
 * URLs in the generated HTML.
 */

const fs = require('fs')
const path = require('path')

const buildDir = path.resolve(__dirname, '..', 'build')
const tmpDir = path.resolve(__dirname, '..', '_build_tmp')

console.log('[nest-build] Moving build output into /openclaw/ subdirectory...')

// 1. Rename build → _build_tmp
fs.renameSync(buildDir, tmpDir)

// 2. Create fresh build/openclaw
fs.mkdirSync(path.join(buildDir, 'openclaw'), { recursive: true })

// 3. Move all contents from _build_tmp into build/openclaw
const items = fs.readdirSync(tmpDir)
for (const item of items) {
  fs.renameSync(path.join(tmpDir, item), path.join(buildDir, 'openclaw', item))
}

// 4. Clean up temp dir
fs.rmdirSync(tmpDir)

console.log('[nest-build] Done. Files now served from /openclaw/')
