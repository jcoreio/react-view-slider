# react-view-slider

[![CircleCI](https://circleci.com/gh/jcoreio/react-view-slider.svg?style=svg)](https://circleci.com/gh/jcoreio/react-view-slider)
[![Coverage Status](https://codecov.io/gh/jcoreio/react-view-slider)](https://codecov.io/gh/jcoreio/react-view-slider)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/react-view-slider.svg)](https://badge.fury.io/js/react-view-slider)

Not another carousel; animates horizontal slide transitions between steps of
a form or levels of a drilldown.

# Table of Contents

- [Usage](#usage)
- [Props](#props)
- [`SimpleViewSlider`](#simpleviewslider)

## Usage

```sh
npm install --save react-view-slider
```

```js
import React from 'react'
import ReactDOM from 'react-dom'
import ViewSlider from 'react-view-slider'

// This function renders the view at the given index.
const renderView = ({ index, active, transitionState }) => (
  <div>
    <h3>View {index}</h3>
    <p>I am {active ? 'active' : 'inactive'}</p>
    <p>transitionState: {transitionState}</p>
  </div>
)

// activeView specifies which view should currently be showing.  Whenever you change it, ViewSlider will make the
// view at the new activeView horizontally slide into view.

ReactDOM.render(
  <ViewSlider
    renderView={renderView}
    numViews={3}
    activeView={0}
    animateHeight
  />,
  document.getElementById('root')
)
```

## Props

##### `renderView: (props: ViewProps) => React.Node` **(required)**

This function renders each view. `ViewSlider` will call it with the following `props`:

- `index: number` - the index of the view (starting at 0)
- `active: boolean` - whether the view should currently be showing
- `transitionState: 'in' | 'out' | 'entering' | 'leaving'` - the view's transition state

##### `numViews: number` **(required)**

The number of views present. `ViewSlider` will only render all views when transitioning; when idle, it will
only render the active view.

##### `activeView: number` **(required)**

The index of the view that should be showing. Whenever you change this, `ViewSlider` will animate a horizontal slide
transition to the view at the new index.

##### `spacing: number` (default: `1`)

How much horizontal space to put between the views. `spacing={1.5}` will space
the views apart by 50% of the width, `spacing={2}` will space the views apart
by 100% of the width, etc.

Views without much horizontal padding or margin of their own will look jammed
together during transitions with a default `spacing` of 1, so in that case
you'll want to increase the `spacing`.

A negative number will reverse the view order;
`spacing={-1.5}` will arrange views from right to left with 50% width view
spacing. You can also use the `rtl` property for this, especially if you want
the views to inherit `direction: rtl` for their own content layout.

##### `rtl: boolean` (default: `false`)

Whether to use right-to-left layout. This will reverse the view order and apply
`direction: rtl` to the viewport style, and each view will inherit that layout
direction for its own content as well.

To reverse the view order without
changing layout direction of each view's content, you can use a negative number
for `spacing`.

##### `keepViewsMounted: boolean` (default: `false`)

If `true`, `ViewSlider` will keep all views mounted after transitioning, not just the active view.
You may want to use this if there is a noticeable lag while other views mount at the beginning of a transition.
However, it disables height animation and will cause the height of `ViewSlider` to be the max of all views' heights,
so you will get best results if you also use `fillParent={true}`.

##### `animateHeight: boolean` (default: `true`)

If truthy, `ViewSlider` will animate its height to match the height of the view at `activeView`.

##### `transitionDuration: number` (default: `500`)

The duration of the transition between views.

##### `transitionTimingFunction: string` (default: `'ease'`)

The timing function for the transition between views.

##### `onSlideTransitionEnd: () => any`

If given, will be called when the slide transition ends.

##### `prefixer: Prefixer`

If given, overrides the `inline-style-prefixer` used to autoprefix inline styles.

##### `fillParent: boolean` (default: `false`)

If truthy, `ViewSlider` will use absolute positioning on itself and its views to fill its parent element.

##### `className: string`

Any extra class names to add to the root element.

##### `style: Object`

Extra inline styles to add to the root element.

##### `viewportClassName: string`

Any extra class names to add to the inner "viewport" element.

##### `viewportStyle: Object`

Extra inline styles to add to the inner "viewport" element.

##### `viewStyle: Object`

Extra inline styles to add to the view wrapper elements.

##### `innerViewWrapperStyle: Object`

Extra inline styles to add to the inner div between the `viewStyle` div and your
view content element. (The inner div was added to ensure perfect height
animation.)

##### `rootRef: (node: ?HTMLDivElement) => any`

The `ref` to pass to the root `<div>` element rendered by `ViewSlider`.

##### `viewportRef: (node: ?HTMLDivElement) => any`

The `ref` to pass to the viewport `<div>` element rendered inside the root `<div>` by `ViewSlider`.

## `SimpleViewSlider`

This is a wrapper for `ViewSlider` that takes a single child element. It renders the `ViewSlider` with the child's key
(converted to a number) as the `activeView` and caches past child elements by key.

### Example

```js
import SimpleViewSlider from 'react-view-slider/simple'

ReactDOM.render(
  <SimpleViewSlider>
    <div key={0}>This is view 0</div>
  </SimpleViewSlider>,
  document.getElementById('root')
)

// Rendering a child with a different key will trigger the transition.
ReactDOM.render(
  <SimpleViewSlider>
    <div key={1}>This is view 1</div>
  </SimpleViewSlider>,
  document.getElementById('root')
)
```

### Additional props

##### `keepPrecedingViewsMounted: boolean` (default: `false`)

If `true`, `SimpleViewSlider` will keep views preceding the active view mounted, but not views following the active view.
(As mentioned above, the order is determined by the `children`'s `key`s.)
