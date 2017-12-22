// @flow

import * as React from 'react'
import ViewSlider from './index'
import type {Props, DefaultProps} from './index'
import TransitionContext from 'react-transition-context'

type TransitionState = 'in' | 'out' | 'entering' | 'leaving'

export type ViewProps = {
  index: number,
  key: number,
  active: boolean,
  transitionState: TransitionState,
  style: Object,
  ref: (element: React.ElementRef<string>) => mixed,
}

export default class ViewSliderWithTransitionContext extends React.Component<Props> {
  static defaultProps: DefaultProps = ViewSlider.defaultProps;
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

