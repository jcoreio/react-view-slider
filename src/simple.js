/* @flow */
/* eslint-env browser */

import React from 'react'
import Prefixer from 'inline-style-prefixer'
import ViewSlider from './index'

import type {Props as ViewSliderProps, ViewProps} from './index'

export type Props = {
  children?: any,
  keepViewsMounted?: boolean,
  animateHeight?: boolean,
  transitionDuration?: number,
  transitionTimingFunction?: string,
  prefixer?: Prefixer,
  fillParent?: boolean,
  className?: string,
  style?: Object,
  viewportClassName?: string,
  viewportStyle?: Object,
  measureHeight?: (node: HTMLElement) => number,
  rootRef?: (node: ?HTMLDivElement) => any,
  viewportRef?: (node: ?HTMLDivElement) => any,
}

export type State = {
  views: Array<React.Element<any>>,
  activeView: number,
}

function defaultRenderView({index, key, style, ref}: ViewProps): React.Element<any> {
  return (
    <div key={key} style={style} ref={ref}>
      {this.state.views[index]}
    </div>
  )
}

export function createSimpleViewSlider(
  ViewSlider: ReactClass<ViewSliderProps>,
  renderView: (props: ViewProps) => React.Element<any> = defaultRenderView
): Class<React.Component<void, Props, State>> {
  return class SimpleViewSlider extends React.Component<void, Props, State> {
    state: State

    constructor(props: Props) {
      super(props)
      const child = React.Children.only(props.children)
      const activeView = parseInt(child.key)
      const views = []
      views[activeView] = child
      this.state = {
        views,
        activeView,
      }
    }

    componentWillReceiveProps(nextProps: Props) {
      if (nextProps.children !== this.props.children) {
        const child = React.Children.only(nextProps.children)
        const activeView = parseInt(child.key)
        const views = [...this.state.views]
        views[activeView] = child
        this.setState({
          views,
          activeView,
        })
      }
    }

    renderView = renderView.bind(this)

    render(): React.Element<any> {
      const {
        children, // eslint-disable-line no-unused-vars
        ...props
      } = this.props
      const {activeView, views} = this.state
      return (
        <ViewSlider
            {...props}
            renderView={this.renderView}
            numViews={views.length}
            activeView={activeView}
        />
      )
    }
  }
}

export default createSimpleViewSlider(ViewSlider)

