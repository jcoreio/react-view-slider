/* @flow */
/* eslint-env browser */

import React, {Component} from 'react'
import classNames from 'class-names'
import Prefixer from 'inline-style-prefixer'
import getNodeDimensions from 'get-node-dimensions'
import range from 'lodash.range'

type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

export type ChildProps = {
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
  transitionTimeout: number,
  prefixer: Prefixer,
  style: Object,
  innerStyle: Object,
}

export type Props = {
  activeIndex: number,
  numChildren: number,
  renderChild: (props: ChildProps) => React.Element<any>,
  animateHeight: boolean,
  transitionTimeout: number,
  prefixer: Prefixer,
  fillParent?: boolean,
  transitionHeight?: boolean,
  className?: string,
  style: Object,
  innerClassName?: string,
  innerStyle: Object,
}

export type State = {
  height: ?number,
  transitioning: boolean,
  activeIndex: number,
  prevActiveIndex: ?number,
}

function measureHeight(node: ?HTMLElement): ?number {
  if (!node) return null
  return getNodeDimensions(node, {margin: true}).height
}

export default class PageSlider extends Component<DefaultProps, Props, State> {
  static defaultProps = {
    animateHeight: true,
    transitionTimeout: 500,
    prefixer: new Prefixer(),
    style: {},
    innerStyle: {},
  }
  state: State = {
    height: undefined,
    transitioning: false,
    activeIndex: this.props.activeIndex,
    prevActiveIndex: null,
  }
  root: ?HTMLDivElement
  viewport: ?HTMLDivElement
  childElements: Array<?HTMLElement> = []
  timeouts: {[name: string]: number} = {}

  setTimeout(name: string, callback: () => any, delay: number) {
    if (this.timeouts[name]) clearTimeout(this.timeouts[name])
    this.timeouts[name] = setTimeout(callback, delay)
  }

  componentDidUpdate() {
    const {activeIndex, transitionTimeout} = this.props
    let newState: ?$Shape<State>
    if (activeIndex !== this.state.activeIndex && this.state.height === undefined) {
      newState = {height: measureHeight(this.childElements[this.state.activeIndex])}
    } else if (this.state.height !== undefined && !this.state.transitioning) {
      newState = {transitioning: true}
    } else if (activeIndex !== this.state.activeIndex) {
      newState = {
        activeIndex,
        prevActiveIndex: this.state.activeIndex,
        height: measureHeight(this.childElements[activeIndex]),
      }
    }
    const finalNewState = newState
    if (!finalNewState) return

    this.setState(finalNewState, () => {
      if (finalNewState.activeIndex != null) {
        this.setTimeout('onTransitionEnd', this.onTransitionEnd, transitionTimeout)
      }
    })
  }

  onTransitionEnd = (e?: Event) => {
    this.setState({
      height: undefined,
      prevActiveIndex: null,
      transitioning: false,
    })
  }

  componentWillUnmount() {
    for (let name in this.timeouts) clearTimeout(this.timeouts[name])
  }

  getTransitionState: (childIndex: number) => TransitionState = (childIndex: number): TransitionState => {
    const {activeIndex, prevActiveIndex} = this.state
    if (prevActiveIndex == null) return childIndex === activeIndex ? 'in' : 'out'
    if (childIndex === activeIndex) return 'entering'
    if (childIndex === prevActiveIndex) return 'leaving'
    return 'out'
  }

  renderChild: (index: number) => React.Element<any> = (index: number): React.Element<any> => {
    const {fillParent} = this.props
    const {activeIndex, transitioning} = this.state
    if (!transitioning && activeIndex !== index) {
      return <div key={index} className="react-page-slider__child"></div>
    }
    return this.props.renderChild({
      index,
      key: index,
      active: index === activeIndex,
      className: 'react-page-slider__child',
      transitionState: this.getTransitionState(index),
      style: fillParent ? {left: `${index * 100}%`} : {},
      ref: c => this.childElements[index] = c,
    })
  }

  render(): React.Element<any> {
    const {style, className, innerClassName, innerStyle, numChildren, prefixer, animateHeight, fillParent} = this.props
    const {activeIndex, height, transitioning} = this.state

    const finalClassName = classNames(className, 'react-page-slider__root', {
      'react-page-slider__root--transitioning': transitioning,
      'react-page-slider__root--fill-parent': fillParent,
    })

    const finalOuterStyle = prefixer.prefix(
      animateHeight && !fillParent && height != null
        ? {height, ...style}
        : style
    )

    const finalInnerStyle = prefixer.prefix({
      transform: `translateX(-${activeIndex * 100}%)`,
      ...innerStyle,
    })

    const children = range(transitioning ? numChildren : activeIndex + 1).map(this.renderChild)

    return (
      <div
          style={finalOuterStyle}
          className={finalClassName}
          ref={c => this.root = c}
      >
        <div
            className={classNames(innerClassName, 'react-page-slider__track')}
            style={finalInnerStyle}
            ref={c => this.viewport = c}
            onTransitionEnd={this.onTransitionEnd}
        >
          {children}
        </div>
      </div>
    )
  }
}


