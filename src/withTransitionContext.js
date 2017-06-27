// @flow

import React, {Component} from 'react'
import PageSlider from './index'
import TransitionContext from 'react-transition-context'
import type {Prefixer} from 'inline-style-prefixer'

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

export type Props = {
  activePage: number,
  numPages: number,
  renderPage: (props: PageProps) => React.Element<any>,
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


export default class PageSliderWithTransitionContext extends Component<void, Props, void> {
  renderPage: (props: PageProps) => React.Element<any> = (props: PageProps): React.Element<any> => {
    return (
      <TransitionContext key={props.key} transitionState={props.transitionState}>
        {this.props.renderPage(props)}
      </TransitionContext>
    )
  }

  render(): React.Element<any> {
    return (
      <PageSlider {...this.props} renderPage={this.renderPage} />
    )
  }
}

