// @flow

import * as React from 'react'
import ViewSlider from './index'
import TransitionContext from 'react-transition-context'
import {createSimpleViewSlider} from './simple'
import type {ViewProps} from './index'

function renderView({index, key, style, ref, transitionState}: ViewProps): React.Element<React.ComponentType<typeof TransitionContext>> {
  return (
    <TransitionContext key={key} transitionState={transitionState}>
      <div key={key} style={style} ref={ref}>
        {this.state.views[index]}
      </div>
    </TransitionContext>
  )
}

export default createSimpleViewSlider(ViewSlider, renderView)

