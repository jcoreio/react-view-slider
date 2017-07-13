import React from 'react'
import ViewSlider from '../src'
import ViewSliderWithTransitionContext from '../src/withTransitionContext'
import {mount} from 'enzyme'
import {expect} from 'chai'
import sinon from 'sinon'

import {TransitionListener} from 'react-transition-context'

describe('ViewSlider', () => {
  let clock
  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
  })

  it('single transition works', () => {
    const renderView = ({index, key, style, className, ref}) => (
      <div
          key={key}
          ref={ref}
          className={className}
          style={{
            ...style,
            height: (index + 1) * 100,
          }}
      >
        Child {index}
      </div>
    )

    const comp = mount(
      <ViewSlider numViews={3} renderView={renderView} activeView={0} />
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({activeView: 1})

    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 1')

    comp.unmount()
  })
  it('fillParent works', () => {
    const views = []

    const renderView = ({index, key, style, className, ref}) => (
      <div
          key={key}
          ref={c => {
            ref(c)
            views[index] = c
          }}
          className={className}
          style={{
            ...style,
            height: (index + 1) * 100,
          }}
      >
        Child {index}
      </div>
    )

    let root, viewport
    const comp = mount(
      <ViewSlider
          rootRef={c => root = c}
          viewportRef={c => viewport = c}
          fillParent
          numViews={3}
          renderView={renderView}
          activeView={0}
      />
    )

    function expectHasFillStyle(element, left = '0px') {
      expect(element.style.position).to.equal('absolute')
      expect(element.style.top).to.equal('0px')
      expect(element.style.left).to.equal(left)
      expect(element.style.right).to.equal('0px')
      expect(element.style.bottom).to.equal('0px')
    }
    expectHasFillStyle(root)
    expectHasFillStyle(viewport)
    expectHasFillStyle(views[0], '0%')

    comp.setProps({activeView: 1})
    expectHasFillStyle(views[1], '100%')

    comp.unmount()
  })
  it('multiple transitions work', () => {
    const renderView = ({index, key, style, className, ref}) => (
      <div
          key={key}
          ref={ref}
          className={className}
          style={{
            ...style,
            height: index * 100,
          }}
      >
        Child {index}
      </div>
    )

    const comp = mount(
      <ViewSlider numViews={3} renderView={renderView} activeView={0} />
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({activeView: 1})
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(200)
    comp.setProps({activeView: 2})
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 2')

    comp.unmount()
  })
  it('withTransitionContext works', () => {
    const inputs = []

    class View extends React.Component {
      input = null

      didComeIn = () => {
        if (this.input) this.input.focus()
      }

      render() {
        const {index, style, innerRef} = this.props
        return (
          <div
              ref={innerRef}
              style={{
                ...style,
                height: index * 100,
              }}
          >
            Child {index}
            <input type="text" ref={c => {
              this.input = c
              inputs[index] = c
            }}
            />
            <TransitionListener didComeIn={this.didComeIn} />
          </div>
        )
      }
    }

    const renderView = ({ref, ...props}) => <View {...props} innerRef={ref} />

    const comp = mount(
      <ViewSliderWithTransitionContext numViews={3} renderView={renderView} activeView={0} />
    )

    expect(comp.text()).to.equal('Child 0')
    expect(document.activeElement).to.equal(inputs[0])

    comp.setProps({activeView: 1})
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(200)
    comp.setProps({activeView: 2})
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 2')
    expect(document.activeElement).to.equal(inputs[2])

    comp.unmount()
  })
  it('keepViewsMounted works', () => {
    const views = []

    const renderView = ({index, key, style, ref}) => (
      <div
          key={key}
          ref={c => {
            ref(c)
            views[index] = c
          }}
          className=".view"
          style={{
            ...style,
            height: (index + 1) * 1000,
          }}
      >
        Child {index}
      </div>
    )

    const comp = mount(
      <ViewSlider
          fillParent
          keepViewsMounted
          numViews={3}
          renderView={renderView}
          activeView={0}
      />
    )
    expect(comp.text()).to.equal('Child 0Child 1Child 2')

    views[2].scrollTop = 800
    expect(views[2].scrollTop).to.equal(800)
    comp.setProps({activeView: 2})
    expect(views[2].scrollTop).to.equal(0)

    comp.unmount()
  })
})

