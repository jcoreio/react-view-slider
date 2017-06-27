/* @flow */
/* eslint-env browser */

import React, {Component} from 'react'
import classNames from 'class-names'
import Prefixer from 'inline-style-prefixer'
import getNodeDimensions from 'get-node-dimensions'
import range from 'lodash.range'

type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

export type PageProps = {
  index: number,
  key: number,
  active: boolean,
  transitionState: TransitionState,
  className: string,
  style: Object,
  ref: (element: HTMLElement) => any,
}

export type DefaultProps = {
  animateHeight: boolean,
  transitionDuration: number,
  transitionTimingFunction: string,
  prefixer: Prefixer,
  style: Object,
  viewportStyle: Object,
}

export type Props = {
  activePage: number,
  numPages: number,
  renderPage: (props: PageProps) => React.Element<any>,
  animateHeight: boolean,
  transitionDuration: number,
  transitionTimingFunction: string,
  prefixer: Prefixer,
  fillParent?: boolean,
  className?: string,
  style: Object,
  viewportClassName?: string,
  viewportStyle: Object,
}

export type State = {
  height: ?number,
  transitioning: boolean,
  activePage: number,
  prevActivePage: ?number,
}

function measureHeight(node: ?HTMLElement): ?number {
  if (!node) return null
  return getNodeDimensions(node, {margin: true}).height
}

export default class PageSlider extends Component<DefaultProps, Props, State> {
  static defaultProps = {
    animateHeight: true,
    transitionDuration: 500,
    transitionTimingFunction: 'ease',
    prefixer: new Prefixer(),
    style: {},
    viewportStyle: {},
  }
  state: State = {
    height: undefined,
    transitioning: false,
    activePage: this.props.activePage,
    prevActivePage: null,
  }
  root: ?HTMLDivElement
  viewport: ?HTMLDivElement
  pages: Array<?HTMLElement> = []
  timeouts: {[name: string]: number} = {}

  setTimeout(name: string, callback: () => any, delay: number) {
    if (this.timeouts[name]) clearTimeout(this.timeouts[name])
    this.timeouts[name] = setTimeout(callback, delay)
  }

  componentDidUpdate() {
    const {activePage, transitionDuration} = this.props
    let newState: ?$Shape<State>

    if (activePage !== this.state.activePage && this.state.height === undefined) {
      // phase 1: set current height
      newState = {height: measureHeight(this.pages[this.state.activePage])}
    } else if (this.state.height !== undefined && !this.state.transitioning) {
      // phase 2: enable transitions
      newState = {transitioning: true}
    } else if (activePage !== this.state.activePage) {
      // phase 3: change height/activePage
      newState = {
        activePage,
        prevActivePage: this.state.activePage,
        height: measureHeight(this.pages[activePage]),
      }
    }

    const finalNewState = newState
    if (!finalNewState) return

    this.setState(finalNewState, () => {
      if (finalNewState.activePage != null) {
        this.setTimeout('onTransitionEnd', this.onTransitionEnd, transitionDuration)
      }
    })
  }

  onTransitionEnd = (e?: Event) => {
    // phase 0: unset height and disable transitions
    this.setState({
      height: undefined,
      prevActivePage: null,
      transitioning: false,
    })
  }

  componentWillUnmount() {
    for (let name in this.timeouts) clearTimeout(this.timeouts[name])
  }

  getTransitionState: (childIndex: number) => TransitionState = (childIndex: number): TransitionState => {
    const {activePage, prevActivePage} = this.state
    if (prevActivePage == null) return childIndex === activePage ? 'in' : 'out'
    if (childIndex === activePage) return 'entering'
    if (childIndex === prevActivePage) return 'leaving'
    return 'out'
  }

  renderPage: (index: number) => React.Element<any> = (index: number): React.Element<any> => {
    const {fillParent} = this.props
    const {activePage, transitioning} = this.state
    // when not transitioning, render empty placeholder divs before the active page to push it into the right
    // horizontal position
    if (!transitioning && activePage !== index) {
      return <div key={index} className="react-page-slider__page"></div>
    }
    return this.props.renderPage({
      index,
      key: index,
      active: index === activePage,
      className: 'react-page-slider__page',
      transitionState: this.getTransitionState(index),
      style: fillParent ? {left: `${index * 100}%`} : {},
      ref: c => this.pages[index] = c,
    })
  }

  render(): React.Element<any> {
    const {
      style, className, viewportClassName, viewportStyle, numPages, prefixer, animateHeight, fillParent,
      transitionDuration, transitionTimingFunction,
    } = this.props
    const {activePage, height, transitioning} = this.state

    const finalClassName = classNames(className, 'react-page-slider__root', {
      'react-page-slider__root--transitioning': transitioning,
      'react-page-slider__root--fill-parent': fillParent,
    })

    const finalOuterStyle = {
      transitionProperty: 'height',
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
      ...style,
    }
    if (animateHeight && !fillParent && height != null) finalOuterStyle.height = height

    const finalViewportStyle = {
      transform: `translateX(-${activePage * 100}%)`,
      ...viewportStyle,
    }
    if (transitioning) {
      finalViewportStyle.transitionProperty = 'transform'
      finalViewportStyle.transitionDuration = `${transitionDuration}ms`
      finalViewportStyle.transitionTimingFunction = transitionTimingFunction
    }

    // when not transitioning, render empty placeholder divs before the active page to push it into the right
    // horizontal position
    const pages = range(transitioning ? numPages : activePage + 1).map(this.renderPage)

    return (
      <div
          style={prefixer.prefix(finalOuterStyle)}
          className={finalClassName}
          ref={c => this.root = c}
      >
        <div
            className={classNames(viewportClassName, 'react-page-slider__track')}
            style={prefixer.prefix(finalViewportStyle)}
            ref={c => this.viewport = c}
            onTransitionEnd={this.onTransitionEnd}
        >
          {pages}
        </div>
      </div>
    )
  }
}


