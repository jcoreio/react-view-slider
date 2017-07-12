import React from 'react'
import { storiesOf } from '@storybook/react'
import BaseViewSlider from '../src'
import BaseViewSliderWithTransitionContext from '../src/withTransitionContext'
import {TransitionListener} from 'react-transition-context'
import Prefixer from 'inline-style-prefixer'
import injectSheet from 'react-jss'
import defaultStyles from '../src/styles'

const ViewSlider = injectSheet(defaultStyles)(BaseViewSlider)
const ViewSliderWithTransitionContext = injectSheet(defaultStyles)(BaseViewSliderWithTransitionContext)

/* eslint-env browser */

const smokeTestPages = [
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
  state = {activePage: 0}
  inputRefs: Array<HTMLInputElement> = []

  pageDidComeIn = index => {
    if (this.inputRefs[index]) {
      this.inputRefs[index].focus()
      this.inputRefs[index].select()
    }
  }

  renderPage = ({index, key, transitionState, className, style, ref}) => {
    const finalStyle = this.props.margins
      ? {...smokeTestPages[index], marginTop: 20, marginBottom: 10, paddingTop: 15}
      : smokeTestPages[index]

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
        {this.props.ViewSlider === ViewSliderWithTransitionContext &&
          <TransitionListener didComeIn={() => this.pageDidComeIn(index)} />
        }
      </div>
    )
  }

  render(): React.Element<any> {
    const {fillParent} = this.props
    const SliderComp = this.props.ViewSlider || ViewSlider

    return (
      <div style={fillParent ? styles.fillParent.root : {}}>
        <div style={fillParent ? styles.fillParent.buttons : {}}>
          {smokeTestPages.map((child, index) =>
            <button key={index} onClick={() => this.setState({activePage: index})}>{index}</button>
          )}
        </div>
        <div style={fillParent ? styles.fillParent.content : {}}>
          <SliderComp
              fillParent={fillParent}
              animateHeight={Boolean(this.props.animateHeight)}
              activePage={this.state.activePage}
              numPages={smokeTestPages.length}
              renderPage={this.renderPage}
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
  .add('withTransitionContext', () => <SmokeTest ViewSlider={ViewSliderWithTransitionContext} />)
