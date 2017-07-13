// @flow

import React, {Component} from 'react'
import ViewSlider from './index'
import TransitionContext from 'react-transition-context'
import type {Prefixer} from 'inline-style-prefixer'

type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

export type ViewProps = {
  index: number,
  key: number,
  active: boolean,
  transitionState: TransitionState,
  style: Object,
  ref: (element: HTMLElement) => any,
}

export type Props = {
  activeView: number,
  numViews: number,
  renderView: (props: ViewProps) => React.Element<any>,
  animateHeight?: boolean,
  transitionTimeout?: number,
  prefixer?: Prefixer,
  fillParent?: boolean,
  transitionHeight?: boolean,
  className?: string,
  style?: Object,
  viewportClassName?: string,
  viewportStyle?: Object,
}

export default class ViewSliderWithTransitionContext extends Component<void, Props, void> {
  renderView: (props: ViewProps) => React.Element<any> = (props: ViewProps): React.Element<any> => {
    return (
      <TransitionContext key={props.key} transitionState={props.transitionState}>
        {this.props.renderView(props)}
      </TransitionContext>
    )
  }

  render(): React.Element<any> {
    return (
      <ViewSlider {...this.props} renderView={this.renderView} />
    )
  }
}

