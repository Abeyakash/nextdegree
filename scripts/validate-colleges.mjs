import fs from 'node:fs'
import path from 'node:path'

const filePath = path.join(process.cwd(), 'src', 'data', 'colleges.ts')
const source = fs.readFileSync(filePath, 'utf-8')

const idMatches = [...source.matchAll(/\bid:\s*(\d+)\s*,/g)].map((match) => Number(match[1]))
const slugMatches = [...source.matchAll(/\bslug:\s*"([^"]+)"\s*,/g)].map((match) => match[1])
const nameMatches = [...source.matchAll(/\bname:\s*"([^"]+)"\s*,/g)].map((match) => match[1])

const duplicate = (arr) => arr.filter((item, index) => arr.indexOf(item) !== index)
const duplicateIds = [...new Set(duplicate(idMatches))]
const duplicateSlugs = [...new Set(duplicate(slugMatches))]
const emptyNames = nameMatches.filter((name) => !name.trim())

const hasArray = /export const colleges:\s*College\[\]\s*=\s*\[/.test(source)
if (!hasArray) {
  console.error('Validation failed: colleges array not found.')
  process.exit(1)
}

if (duplicateIds.length > 0) {
  console.error('Validation failed: duplicate college IDs found:', duplicateIds)
  process.exit(1)
}

if (duplicateSlugs.length > 0) {
  console.error('Validation failed: duplicate college slugs found:', duplicateSlugs)
  process.exit(1)
}

if (emptyNames.length > 0) {
  console.error('Validation failed: empty college names found.')
  process.exit(1)
}

if (idMatches.length < 30) {
  console.error('Validation failed: too few colleges found:', idMatches.length)
  process.exit(1)
}

console.log(`College data validation passed: ${idMatches.length} colleges, no duplicate ids/slugs.`)
