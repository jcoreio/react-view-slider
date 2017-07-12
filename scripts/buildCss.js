#!/usr/bin/env babel-node

import jss from 'jss'
import nested from 'jss-nested'
import fs from 'fs'
import path from 'path'

jss.use(nested())

import styles from '../src/styles'

const sheet = jss.createStyleSheet(styles)

const src = path.resolve(__dirname, '..', 'src')
const lib = path.resolve(__dirname, '..', 'lib')

try {
  fs.statSync(lib)
} catch (error) {
  fs.mkdirSync(lib)
}

fs.writeFileSync(
  path.resolve(src, 'defaultClasses.js'),
  '/* eslint-disable */\nmodule.exports = ' + JSON.stringify(sheet.classes) + '\n',
  'utf8'
)
console.error('src/styles.js -> src/defaultClasses.js') // eslint-disable-line no-console

fs.writeFileSync(path.resolve(lib, 'react-view-slider.css'), sheet.toString(), 'utf8')
console.error('src/styles.js -> lib/react-view-slider.css') // eslint-disable-line no-console

