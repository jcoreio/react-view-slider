import React from 'react'
import { storiesOf } from '@storybook/react'
import PageSlider from '../src'
import PageSliderWithTransitionContext from '../src/withTransitionContext'
import {TransitionListener} from 'react-transition-context'
import '../src/react-page-slider.sass'
import Prefixer from 'inline-style-prefixer'

/* eslint-env browser */

const smokeTestChildren = [
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
  state = {activeIndex: 0}
  inputRefs: Array<HTMLInputElement> = []

  childDidComeIn = index => {
    if (this.inputRefs[index]) {
      this.inputRefs[index].focus()
      this.inputRefs[index].select()
    }
  }

  renderChild = ({index, key, transitionState, className, style, ref}) => {
    const finalStyle = this.props.margins
      ? {...smokeTestChildren[index], marginTop: 20, marginBottom: 10, paddingTop: 15}
      : smokeTestChildren[index]

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
            Child {index}
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
        {this.props.PageSlider === PageSliderWithTransitionContext &&
          <TransitionListener didComeIn={() => this.childDidComeIn(index)} />
        }
      </div>
    )
  }

  render(): React.Element<any> {
    const {fillParent} = this.props
    const SliderComp = this.props.PageSlider || PageSlider

    return (
      <div style={fillParent ? styles.fillParent.root : {}}>
        <div style={fillParent ? styles.fillParent.buttons : {}}>
          {smokeTestChildren.map((child, index) =>
            <button key={index} onClick={() => this.setState({activeIndex: index})}>{index}</button>
          )}
        </div>
        <div style={fillParent ? styles.fillParent.content : {}}>
          <SliderComp
              fillParent={fillParent}
              animateHeight={Boolean(this.props.animateHeight)}
              activeIndex={this.state.activeIndex}
              numChildren={smokeTestChildren.length}
              renderChild={this.renderChild}
          />
        </div>
      </div>
    )
  }
}

storiesOf('react-page-slider', module)
  .add('with animateHeight', () => <SmokeTest animateHeight />)
  .add('without animateHeight', () => <SmokeTest />)
  .add('with fillParent', () => <SmokeTest fillParent />)
  .add('with margins', () => <SmokeTest animateHeight margins />)
  .add('withTransitionContext', () => <SmokeTest PageSlider={PageSliderWithTransitionContext} />)
