import * as React from 'react'
import { describe, it } from 'mocha'
import { mount } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import ViewSlider from '../src'
import SimpleViewSlider from '../src/simple'

let clock
beforeEach(() => {
  clock = sinon.useFakeTimers()
})
afterEach(() => {
  clock.restore()
})

describe('ViewSlider', () => {
  it('single transition works', () => {
    const renderView = ({ index }) => <div>Child {index}</div>

    const comp = mount(
      <ViewSlider numViews={3} renderView={renderView} activeView={0} />
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({ activeView: 1 }).update()

    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 1')

    comp.unmount()
  })
  it('fillParent works', () => {
    const views = []

    const renderView = ({ index }) => (
      <div
        ref={c => {
          views[index] = c
        }}
        style={{
          height: (index + 1) * 100,
        }}
      >
        Child {index}
      </div>
    )

    let root, viewport
    const comp = mount(
      <ViewSlider
        rootRef={c => (root = c)}
        viewportRef={c => (viewport = c)}
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
    expectHasFillStyle(views[0].parentElement.parentElement, '0%')

    comp.setProps({ activeView: 1 }).update()
    expectHasFillStyle(views[1].parentElement.parentElement, '100%')

    comp.unmount()
  })
  it('multiple transitions work', () => {
    const renderView = ({ index }) => (
      <div
        style={{
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

    comp.setProps({ activeView: 1 }).update()
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(200)
    comp.setProps({ activeView: 2 }).update()
    expect(comp.text()).to.equal('Child 0Child 1Child 2')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 2')

    comp.unmount()
  })
  it('keepViewsMounted works', () => {
    const views = []

    const renderView = ({ index }) => (
      <div
        ref={c => {
          views[index] = c
        }}
        style={{
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

    views[2].parentElement.parentElement.scrollTop = 800
    expect(views[2].parentElement.parentElement.scrollTop).to.equal(800)
    comp.setProps({ activeView: 2 }).update()
    expect(views[2].parentElement.parentElement.scrollTop).to.equal(0)

    comp.unmount()
  })
})

describe('SimpleViewSlider', () => {
  it('single transition works', () => {
    const comp = mount(
      <SimpleViewSlider>
        <div key={0}>Child 0</div>
      </SimpleViewSlider>
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({ children: <div key={1}>Child 1</div> }).update()

    expect(comp.text()).to.equal('Child 0Child 1')
    clock.tick(1000)
    expect(comp.text()).to.equal('Child 1')

    comp.unmount()
  })
  it('keepViewsMounted works', () => {
    const comp = mount(
      <SimpleViewSlider keepViewsMounted>
        <div key={0}>Child 0</div>
      </SimpleViewSlider>
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({
      children: <div key={1}>Child 1</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child 1')

    comp.setProps({
      children: <div key={2}>Child 2</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child 1Child 2')

    comp.setProps({
      children: <div key={1}>Child a</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child aChild 2')

    comp.unmount()
  })
  it('keepPrecedingViewsMounted works', () => {
    const comp = mount(
      <SimpleViewSlider keepPrecedingViewsMounted>
        <div key={0}>Child 0</div>
      </SimpleViewSlider>
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({
      children: <div key={1}>Child 1</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child 1')

    comp.setProps({
      children: <div key={2}>Child 2</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child 1Child 2')

    comp.setProps({
      children: <div key={1}>Child a</div>,
    })
    expect(comp.update().text()).to.equal('Child 0Child aChild 2')

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child a')

    comp.unmount()
  })
  it('changing keepPrecedingViewsMounted works', () => {
    const comp = mount(
      <SimpleViewSlider keepViewsMounted>
        <div key={0}>Child 0</div>
      </SimpleViewSlider>
    )

    expect(comp.text()).to.equal('Child 0')

    comp.setProps({
      children: <div key={1}>Child 1</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child 1')

    comp.setProps({
      children: <div key={2}>Child 2</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child 1Child 2')

    comp.setProps({
      keepViewsMounted: false,
      keepPrecedingViewsMounted: true,
      children: <div key={1}>Child a</div>,
    })

    clock.tick(1000)
    expect(comp.update().text()).to.equal('Child 0Child a')

    comp.unmount()
  })
})
