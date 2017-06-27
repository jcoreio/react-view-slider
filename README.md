# react-page-slider

[![Build Status](https://travis-ci.org/jcoreio/react-page-slider.svg?branch=master)](https://travis-ci.org/jcoreio/react-page-slider)
[![Coverage Status](https://coveralls.io/repos/github/jcoreio/react-page-slider/badge.svg?branch=master)](https://coveralls.io/github/jcoreio/react-page-slider?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

horizontal slide transitions between components

## Usage

```sh
npm install --save react-page-slider
```

```js
import React from 'react'
import ReactDOM from 'react-dom'
import PageSlider from 'react-page-slider'

// make sure to include react-page-slider/lib/react-page-slider.css in the page.
// for instance if you're using webpack:
import 'react-page-slider/lib/react-page-slider.css'

// This function renders the page at the given index.
// At minimum you should pass the key, ref, style, and className props to the returned element.
const renderPage = ({index, key, ref, style, className, active, transitionState}) => (
  <div key={key} ref={ref} style={style} className={className}>
    <h3>Page {index}</h3>
    <p>I am {active ? 'active' : 'inactive'}</p>
    <p>transitionState: {transitionState}</p>
  </div>
)

// activePage specifies which page should currently be showing.  Whenever you change it, PageSlider will make the
// page at the new activePage horizontally slide into view.

ReactDOM.render(
  <PageSlider
      renderPage={renderPage}
      numPages={3}
      activePage={0}
      animateHeight
  />,
  document.getElementById('root')
)
```

## Props

### `renderPage: (props: PageProps) => React.Element<any>` **(required)**

This function renders each page.  `PageSlider` will call it with the following `props`:
* `index: number` - the index of the page (starting at 0)
* `key: number` - the key you should pass to the returned element
* `ref: (c: HTMLElement) => any` - the ref you should pass to the returned element
* `style: Object` - the style you should pass to the returned element
* `className: string` - the className you should pass to the returned element
* `active: boolean` - whether the page should currently be showing
* `transitionState: 'in' | 'out' | 'entering' | 'leaving'` - the page's transition state

At minimum you should pass the `key`, `ref`, `style`, and `className` props to the returned element.

### `numPages: number` **(required)**

The number of pages present.  `PageSlider` will only render all pages when transitioning; when idle, it will
only render the active page.

### `activePage: number` **(required)**

The index of the page that should be showing.  Whenever you change this, `PageSlider` will animate a horizontal slide
transition to the page at the new index.

### `animateHeight: boolean` (default: `true`)

If truthy, `PageSlider` will animate its height to match the height of the page at `activePage`.

### `transitionDuration: number` (default: `500`)

The duration of the transition between pages.

### `transitionTimingFunction: string` (default: `'ease'`)

The timing function for the transition between pages.

### `prefixer: Prefixer`

If given, overrides the `inline-style-prefixer` used to autoprefix inline styles.

### `fillParent: boolean` (default: `false`)

If truthy, `PageSlider` will use absolute positioning on itself and its pages to fill its parent element.

### `className: string`

Any extra class names to add to the root element.

### `style: Object`

Extra inline styles to add to the root element.

### `viewportClassName: string`

Any extra class names to add to the inner "viewport" element.

### `viewportStyle: Object`

Extra inline styles to add to the inner "viewport" element.

## `withTransitionContext`

```js
import PageSlider from 'react-page-slider/lib/withTransitionContext'
```

This works exactly like `PageSlider` except that it renders its pages within a `TransitionContext` component from
`react-transition-context` with the given `transitionState`.  This is useful for doing things like focusing an `<input>`
element after one of the pages has transitioned in.

