// @flow

import React, {Component} from 'react'
import PageSlider from './index'
import TransitionContext from 'react-transition-context'
import type {Prefixer} from 'inline-style-prefixer'

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

export type Props = {
  activeIndex: number,
  numChildren: number,
  renderChild: (props: ChildProps) => React.Element<any>,
  animateHeight?: boolean,
  transitionTimeout?: number,
  prefixer?: Prefixer,
  fillParent?: boolean,
  transitionHeight?: boolean,
  className?: string,
  style?: Object,
  innerClassName?: string,
  innerStyle?: Object,
}


export default class PageSliderWithTransitionContext extends Component<void, Props, void> {
  renderChild: (props: ChildProps) => React.Element<any> = (props: ChildProps): React.Element<any> => {
    return (
      <TransitionContext transitionState={props.transitionState}>
        {this.props.renderChild(props)}
      </TransitionContext>
    )
  }

  render(): React.Element<any> {
    return (
      <PageSlider {...this.props} renderChild={this.renderChild} />
    )
  }
}

