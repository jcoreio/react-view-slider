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

// This function renders the child at the given index.
// At minimum you should pass the key, ref, style, and className props to the returned element.
const renderChild = ({index, key, ref, style, className, active, transitionState}) => (
  <div key={key} ref={ref} style={style} className={className}>
    <h3>Child {index}</h3>
    <p>I am {active ? 'active' : 'inactive'}</p>
    <p>transitionState: {transitionState}</p>
  </div>
)

// activeIndex specifies which child should currently be showing.  Whenever you change it, PageSlider will make the
// child at the new activeIndex horizontally slide into view.

ReactDOM.render(
  <PageSlider
      renderChild={renderChild}
      numChildren={3}
      activeIndex={0}
      animateHeight
  />,
  document.getElementById('root')
)
```

