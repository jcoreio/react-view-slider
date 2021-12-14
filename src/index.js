/* @flow */
/* eslint-env browser */

import * as React from 'react'
import Prefixer from 'inline-style-prefixer'
import { TransitionContext } from 'react-transition-context'

type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

export type ViewProps = {
  index: number,
  active: boolean,
  transitionState: TransitionState,
}

export type DefaultProps = {
  animateHeight: boolean,
  keepViewsMounted: boolean,
  transitionDuration: number,
  transitionTimingFunction: string,
  prefixer: Prefixer,
  style: Object,
  viewportStyle: Object,
  rtl: boolean,
  spacing: number,
}

export type Props = {
  activeView: number,
  numViews: number,
  renderView: (props: ViewProps) => React.Node,
  keepViewsMounted?: ?boolean,
  animateHeight?: ?boolean,
  transitionDuration?: ?number,
  transitionTimingFunction?: ?string,
  onSlideTransitionEnd?: ?() => mixed,
  prefixer?: ?Prefixer,
  fillParent?: ?boolean,
  className?: ?string,
  style?: ?Object,
  viewportClassName?: ?string,
  viewportStyle?: ?Object,
  viewStyle?: ?Object,
  innerViewWrapperStyle?: ?Object,
  rootRef?: ?(node: ?React.ElementRef<'div'>) => mixed,
  viewportRef?: ?(node: ?React.ElementRef<'div'>) => mixed,
  rtl?: ?boolean,
  spacing?: ?number,
}

type DefaultedProps = {
  activeView: number,
  numViews: number,
  renderView: (props: ViewProps) => React.Node,
  keepViewsMounted: boolean,
  animateHeight: boolean,
  transitionDuration: number,
  transitionTimingFunction: string,
  prefixer: Prefixer,
  fillParent?: boolean,
  className?: string,
  style: Object,
  viewportClassName?: ?string,
  viewportStyle: Object,
  viewStyle?: ?Object,
  innerViewWrapperStyle?: ?Object,
  rootRef?: ?(node: ?React.ElementRef<'div'>) => mixed,
  viewportRef?: ?(node: ?React.ElementRef<'div'>) => mixed,
  rtl: boolean,
  spacing: number,
}

export type State = {
  height: ?number,
  transitioning: boolean,
  activeView: number,
  numViews: number,
  prevActiveView: ?number,
}

const fillStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const baseViewStyle = {
  display: 'inline-block',
  verticalAlign: 'top',
  whiteSpace: 'normal',
  width: '100%',
}

export const defaultProps: DefaultProps = {
  animateHeight: true,
  transitionDuration: 500,
  transitionTimingFunction: 'ease',
  keepViewsMounted: false,
  prefixer: new Prefixer(),
  style: {},
  viewportStyle: {},
  rtl: false,
  spacing: 1,
}

function applyDefaults(props: Props): DefaultedProps {
  const result: any = { ...props }
  for (const key in defaultProps) {
    if (defaultProps.hasOwnProperty(key) && props[key] == null) {
      result[key] = defaultProps[key]
    }
  }
  return result
}

export default class ViewSlider extends React.Component<Props, State> {
  state: State = {
    height: undefined,
    transitioning: false,
    activeView: this.props.activeView,
    numViews: this.props.numViews,
    // this is used to determine the correct transitionState for the previous active view.
    prevActiveView: null,
  }
  root: ?HTMLDivElement
  viewport: ?HTMLDivElement
  views: Array<?HTMLElement> = []
  timeouts: { [name: string]: any } = {}
  lastProps: Props = this.props
  lastDefaultedProps: ?DefaultedProps

  getDefaultedProps = (): DefaultedProps => {
    if (this.lastProps !== this.props || !this.lastDefaultedProps) {
      this.lastProps = this.props
      this.lastDefaultedProps = applyDefaults(this.props)
    }
    return this.lastDefaultedProps
  }

  measureHeight = (node: ?HTMLElement): ?number => {
    if (!node) return null
    return node.clientHeight
  }

  setTimeout(name: string, callback: () => any, delay: number) {
    if (this.timeouts[name]) clearTimeout(this.timeouts[name])
    this.timeouts[name] = setTimeout(callback, delay)
  }

  componentDidUpdate() {
    const {
      activeView,
      transitionDuration,
      keepViewsMounted,
    } = this.getDefaultedProps()
    let newState: ?$Shape<State>

    if (
      activeView !== this.state.activeView &&
      this.state.height === undefined
    ) {
      if (keepViewsMounted) {
        // scroll all views except the current back to the top
        for (let i = 0; i < this.views.length; i++) {
          if (i === this.state.activeView) continue
          if (this.views[i]) this.views[i].scrollTop = 0
        }
      }
      // phase 1: set current height
      newState = {
        height: this.measureHeight(this.views[this.state.activeView]),
      }
    } else if (this.state.height !== undefined && !this.state.transitioning) {
      // phase 2: enable transitions
      newState = { transitioning: true }
    } else if (activeView !== this.state.activeView) {
      // phase 3: change height/activeView
      newState = {
        activeView,
        numViews: Math.max(this.state.numViews, activeView + 1),
        prevActiveView: this.state.activeView,
        height: this.measureHeight(this.views[activeView]),
      }
    }

    const finalNewState = newState
    if (!finalNewState) return

    this.setState(finalNewState, () => {
      if (finalNewState.activeView != null) {
        this.setTimeout(
          'onTransitionEnd',
          this.onTransitionEnd,
          transitionDuration
        )
      }
    })
  }

  onTransitionEnd = (event?: Event) => {
    // ignore transitionend events from deeper components
    if (event && event.target !== this.viewport) return
    // phase 0: unset height and disable transitions
    this.setState(
      {
        height: undefined,
        numViews: this.props.numViews,
        prevActiveView: null,
        transitioning: false,
      },
      () => {
        const { onSlideTransitionEnd } = this.props
        if (onSlideTransitionEnd) onSlideTransitionEnd()
      }
    )
  }

  componentWillUnmount() {
    for (let name in this.timeouts) clearTimeout(this.timeouts[name])
  }

  getTransitionState: (childIndex: number) => TransitionState = (
    childIndex: number
  ): TransitionState => {
    const { activeView, prevActiveView } = this.state
    if (prevActiveView == null) return childIndex === activeView ? 'in' : 'out'
    if (childIndex === activeView) return 'entering'
    if (childIndex === prevActiveView) return 'leaving'
    return 'out'
  }

  renderView = (index: number): React.Node => {
    const {
      fillParent,
      prefixer,
      keepViewsMounted,
      spacing,
      rtl,
      viewStyle,
      innerViewWrapperStyle,
    } = this.getDefaultedProps()
    const { activeView, transitioning } = this.state

    const style: Object = { ...baseViewStyle, ...viewStyle }
    if (fillParent) {
      Object.assign(style, fillStyle)
      style.overflow = 'auto'
      if (rtl) style.right = `${index * spacing * 100}%`
      else style.left = `${index * spacing * 100}%`
    } else if (index > 0) {
      if (rtl) style.marginRight = `${(spacing - 1) * 100}%`
      else style.marginLeft = `${(spacing - 1) * 100}%`
    }

    // when not transitioning, render empty placeholder divs before the active view to push it into the right
    // horizontal position
    if (!transitioning && activeView !== index && !keepViewsMounted) {
      return <div key={index} style={prefixer.prefix(style)} />
    }
    return (
      <div
        key={index}
        style={prefixer.prefix(style)}
        ref={c => (this.views[index] = c)}
      >
        <div
          style={prefixer.prefix({ width: '100%', ...innerViewWrapperStyle })}
        >
          <TransitionContext state={this.getTransitionState(index)}>
            {this.props.renderView({
              index,
              active: index === activeView,
              transitionState: this.getTransitionState(index),
            })}
          </TransitionContext>
        </div>
      </div>
    )
  }

  animateHeight = (): boolean => {
    const {
      animateHeight,
      fillParent,
      keepViewsMounted,
    } = this.getDefaultedProps()
    return animateHeight && !fillParent && !keepViewsMounted
  }

  rootRef = (node: ?React.ElementRef<'div'>) => {
    this.root = node
    const { rootRef } = this.getDefaultedProps()
    if (rootRef) rootRef(node)
  }
  viewportRef = (node: ?React.ElementRef<'div'>) => {
    this.viewport = node
    const { viewportRef } = this.getDefaultedProps()
    if (viewportRef) viewportRef(node)
  }

  render(): React.Element<'div'> {
    const {
      style,
      className,
      viewportClassName,
      viewportStyle,
      prefixer,
      fillParent,
      transitionDuration,
      transitionTimingFunction,
      keepViewsMounted,
      rtl,
      spacing,
    } = this.getDefaultedProps()
    const animateHeight = this.animateHeight()
    const { activeView, numViews, height, transitioning } = this.state

    const finalOuterStyle = {
      transitionProperty: 'height',
      transitionDuration: `${transitionDuration}ms`,
      transitionTimingFunction,
      overflow: 'hidden',
      height: animateHeight && height != null ? height : undefined,
      ...style,
    }

    const finalViewportStyle = {
      position: 'relative',
      transform: `translateX(calc(${activeView *
        spacing *
        (rtl ? 100 : -100)}% + 0px))`,
      whiteSpace: 'nowrap',
      minHeight: '100%',
      direction: rtl ? 'rtl' : 'ltr',
      transition: transitioning
        ? `transform ${transitionTimingFunction} ${transitionDuration}ms`
        : undefined,
      ...viewportStyle,
    }
    if (fillParent) {
      Object.assign(finalOuterStyle, fillStyle)
      Object.assign(finalViewportStyle, fillStyle)
    }

    // when not transitioning, render empty placeholder divs before the active view to push it into the right
    // horizontal position
    const views = []
    for (
      let i = 0;
      i < (transitioning || keepViewsMounted ? numViews : activeView + 1);
      i++
    ) {
      views[i] = this.renderView(i)
    }

    return (
      <div
        style={prefixer.prefix(finalOuterStyle)}
        className={className}
        ref={this.rootRef}
      >
        <div
          className={viewportClassName}
          style={prefixer.prefix(finalViewportStyle)}
          ref={this.viewportRef}
          onTransitionEnd={this.onTransitionEnd}
        >
          {views}
        </div>
      </div>
    )
  }
}
