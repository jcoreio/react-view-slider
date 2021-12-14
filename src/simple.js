/* @flow */
/* eslint-env browser */

import * as React from 'react'
import Prefixer from 'inline-style-prefixer'
import ViewSlider from './index'
import type { Props as ViewSliderProps, ViewProps } from './index'

export type Props = {
  children?: any,
  keepViewsMounted?: ?boolean,
  keepPrecedingViewsMounted?: ?boolean,
  animateHeight?: ?boolean,
  transitionDuration?: ?number,
  transitionTimingFunction?: ?string,
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

export type State = {
  views: Array<React.Node>,
  activeView: number,
}

function defaultRenderView({ index }: ViewProps): React.Element<'div'> {
  return this.state.views[index]
}

export function createSimpleViewSlider(
  ViewSlider: React.ComponentType<ViewSliderProps>,
  renderView: (props: ViewProps) => React.Node = defaultRenderView
): Class<React.Component<Props, State>> {
  return class SimpleViewSlider extends React.Component<Props, State> {
    state: State

    constructor(props: Props) {
      super(props)
      const child = React.Children.only(props.children)
      const activeView = parseInt(child.key)
      const views = []
      views[activeView] = child
      this.state = { views, activeView }
    }

    componentDidUpdate(prevProps: Props) {
      if (prevProps.children !== this.props.children) {
        const child = React.Children.only(this.props.children)
        const activeView = parseInt(child.key)
        const views = [...this.state.views]
        views[activeView] = child
        if (!this.props.keepViewsMounted) {
          views.length = Math.min(views.length, activeView + 1)
        }
        this.setState({ views, activeView })
      } else if (prevProps.keepViewsMounted && !this.props.keepViewsMounted) {
        const views = [...this.state.views]
        views.length = Math.min(views.length, this.state.activeView + 1)
        this.setState({ views })
      }
    }

    renderView = renderView.bind(this)

    render(): React.Node {
      const {
        children, // eslint-disable-line no-unused-vars
        // Flow's React.ComponentType + defaultProps is foobar...
        spacing,
        rtl,
        keepViewsMounted,
        keepPrecedingViewsMounted,
        ...props
      } = this.props
      const { activeView, views } = this.state
      return (
        <ViewSlider
          {...props}
          keepViewsMounted={keepViewsMounted || keepPrecedingViewsMounted}
          spacing={(spacing: any)}
          rtl={(rtl: any)}
          renderView={this.renderView}
          numViews={views.length}
          activeView={activeView}
        />
      )
    }
  }
}

export default createSimpleViewSlider(ViewSlider)
