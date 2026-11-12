import { transform } from 'esbuild'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function walk(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      files.push(full)
    }
  }
  return files
}

async function transpileFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8')
  const loader = filePath.endsWith('.tsx') ? 'tsx' : 'ts'
  const { code } = await transform(source, {
    loader,
    format: 'esm',
    target: 'es2022',
    jsx: 'automatic',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx',
        useDefineForClassFields: true,
      },
    },
  })
  let out = code
  out = out.replace(/from (['"])([^'"]+)\.tsx\1/g, 'from $1$2.jsx$1')
  out = out.replace(/from (['"])([^'"]+)\.ts\1/g, 'from $1$2.js$1')
  return out.trim()
}

async function convertTree(dir) {
  for (const file of walk(dir)) {
    const out = await transpileFile(file)
    const outFile = file.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js')
    if (!out || out === 'export {};') {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      console.log('removed (types only):', path.relative(root, file))
      continue
    }
    fs.writeFileSync(outFile, out + '\n')
    fs.unlinkSync(file)
    console.log('wrote', path.relative(root, outFile))
  }
}

await convertTree(path.join(root, 'src'))

for (const name of ['vite.config.ts', 'vitest.config.ts']) {
  const file = path.join(root, name)
  if (!fs.existsSync(file)) continue
  const out = await transpileFile(file)
  fs.writeFileSync(file.replace(/\.ts$/, '.js'), out + '\n')
  fs.unlinkSync(file)
}
