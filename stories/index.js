import React from 'react'
import { storiesOf } from '@storybook/react'
import ViewSlider from '../src'
import ViewSliderWithTransitionContext from '../src/withTransitionContext'
import {TransitionListener} from 'react-transition-context'
import Prefixer from 'inline-style-prefixer'
import getNodeDimensions from 'get-node-dimensions'

/* eslint-env browser */

const smokeTestViews = [
  {
    height: 200,
    backgroundColor: 'red',
  },
  {
    height: 500,
    backgroundColor: 'blue',
  },
  {
    height: 80,
    backgroundColor: 'green',
  },
  {
    height: 2000,
    backgroundColor: 'yellow',
  },
  {
    height: 1000,
    backgroundColor: 'orange',
  },
]

const prefixer = new Prefixer()

const styles = {
  fillParent: {
    root: prefixer.prefix({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
    }),
    buttons: prefixer.prefix({
      flex: '0 0 auto',
    }),
    content: prefixer.prefix({
      position: 'relative',
      flex: '1 1 auto',
    }),
  },
}

class SmokeTest extends React.Component {
  state = {activeView: 0}
  inputRefs: Array<HTMLInputElement> = []

  viewDidComeIn = index => {
    if (this.inputRefs[index]) {
      this.inputRefs[index].focus()
      this.inputRefs[index].select()
    }
  }

  renderView = ({index, key, transitionState, className, style, ref}) => {
    const finalStyle = this.props.margins
      ? {...smokeTestViews[index], marginTop: 20, marginBottom: 10, paddingTop: 15}
      : smokeTestViews[index]

    if (this.props.fillParent) {
      return (
         <div
             key={key}
             data-transition-state={transitionState}
             className={className}
             ref={ref}
             style={style}
         >
          <div style={finalStyle}>
            View {index}
          </div>
        </div>
      )
    }
    return (
      <div
          key={key}
          data-transition-state={transitionState}
          className={className}
          ref={ref}
          style={{...style, ...finalStyle}}
      >
        <h3>Child {index}</h3>
        <input type="text" ref={c => this.inputRefs[index] = c} />
        {this.props.ViewSlider === ViewSliderWithTransitionContext &&
          <TransitionListener didComeIn={() => this.viewDidComeIn(index)} />
        }
      </div>
    )
  }

  render(): React.Element<any> {
    const {fillParent, animateHeight, keepViewsMounted} = this.props
    const SliderComp = this.props.ViewSlider || ViewSlider

    return (
      <div style={fillParent ? styles.fillParent.root : {}}>
        <div style={fillParent ? styles.fillParent.buttons : {}}>
          Go to view: {smokeTestViews.map((child, index) =>
            <button key={index} onClick={() => this.setState({activeView: index})}>{index}</button>
          )}
        </div>
        <div style={fillParent ? styles.fillParent.content : {}}>
          <SliderComp
              fillParent={fillParent}
              animateHeight={Boolean(animateHeight)}
              keepViewsMounted={Boolean(keepViewsMounted)}
              activeView={this.state.activeView}
              numViews={smokeTestViews.length}
              renderView={this.renderView}
              measureHeight={node => getNodeDimensions(node, {margin: true}).height}
          />
        </div>
      </div>
    )
  }
}

storiesOf('react-view-slider', module)
  .add('with animateHeight', () => <SmokeTest animateHeight />)
  .add('without animateHeight', () => <SmokeTest />)
  .add('with fillParent', () => <SmokeTest fillParent />)
  .add('with margins', () => <SmokeTest animateHeight margins />)
  .add('with keepViewsMounted', () => <SmokeTest animateHeight keepViewsMounted />)
  .add('with keepViewsMounted and fillParent', () => <SmokeTest fillParent keepViewsMounted />)
  .add('withTransitionContext', () => <SmokeTest animateHeight ViewSlider={ViewSliderWithTransitionContext} />)
