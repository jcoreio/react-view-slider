// @flow

import * as React from 'react'
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
  ref: (element: React.ElementRef<string>) => mixed,
}

export type Props = {
  activeView: number,
  numViews: number,
  renderView: (props: ViewProps) => React.Node,
  animateHeight?: boolean,
  transitionDuration?: number,
  transitionTimingFunction?: string,
  prefixer?: Prefixer,
  fillParent?: boolean,
  className?: string,
  style?: Object,
  viewportClassName?: string,
  viewportStyle?: Object,
}

export default class ViewSliderWithTransitionContext extends React.Component<Props> {
  static defaultProps: Props;
  renderView = (props: ViewProps): React.Element<React.ComponentType<typeof TransitionContext>> => {
    return (
      <TransitionContext key={props.key} transitionState={props.transitionState}>
        {this.props.renderView(props)}
      </TransitionContext>
    )
  }

  render(): React.Element<typeof ViewSlider> {
    return (
      <ViewSlider {...this.props} renderView={this.renderView} />
    )
  }
}

