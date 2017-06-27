import React from 'react'
import ViewSlider from '../src'
import {mount} from 'enzyme'
import {expect} from 'chai'
import sinon from 'sinon'

describe('ViewSlider', () => {
  let clock
  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
  })

  it('single transition works', () => {
    const renderPage = ({index, key, style, className, ref}) => (
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
      <ViewSlider numPages={3} renderPage={renderPage} activePage={0} />
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({activePage: 1})

    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 1')
  })
  it('multiple transitions work', () => {
    const renderPage = ({index, key, style, className, ref}) => (
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
      <ViewSlider numPages={3} renderPage={renderPage} activePage={0} />
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({activePage: 1})
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(200)
    comp.setProps({activePage: 2})
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 2')
  })
})
