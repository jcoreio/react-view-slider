import * as React from 'react'
import { describe, it } from 'mocha'
import { render } from '@testing-library/react'
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
  it('single transition works', async () => {
    const renderView = ({ index }) => (
      <div data-testid={`Child ${index}`}>Child {index}</div>
    )

    const comp = render(
      <ViewSlider
        data-testid="ViewSlider"
        numViews={3}
        renderView={renderView}
        activeView={0}
      />
    )

    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).not.to.exist
    expect(comp.queryByTestId('Child 2')).not.to.exist

    comp.rerender(
      <ViewSlider
        data-testid="ViewSlider"
        numViews={3}
        renderView={renderView}
        activeView={1}
      />
    )
    expect(comp.queryByTestId('Child 1')).to.exist
  })
  it('fillParent works', () => {
    const views = []

    const renderView = ({ index }) => (
      <div
        ref={(c) => {
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
    const comp = render(
      <ViewSlider
        rootRef={(c) => (root = c)}
        viewportRef={(c) => (viewport = c)}
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

    comp.rerender(
      <ViewSlider
        rootRef={(c) => (root = c)}
        viewportRef={(c) => (viewport = c)}
        fillParent
        numViews={3}
        renderView={renderView}
        activeView={1}
      />
    )
    expectHasFillStyle(views[1].parentElement.parentElement, '100%')

    comp.unmount()
  })
  it('multiple transitions work', async () => {
    const renderView = ({ index }) => (
      <div
        style={{
          height: index * 100,
        }}
        data-testid={`Child ${index}`}
      >
        Child {index}
      </div>
    )

    const comp = render(
      <ViewSlider numViews={3} renderView={renderView} activeView={0} />
    )

    expect(comp.queryByTestId('Child 0')).to.exist

    comp.rerender(
      <ViewSlider numViews={3} renderView={renderView} activeView={1} />
    )
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist
    await await clock.tickAsync(200)
    comp.rerender(
      <ViewSlider numViews={3} renderView={renderView} activeView={2} />
    )
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist
    await await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).not.to.exist
  })
  it('keepViewsMounted works', () => {
    const views = []

    const renderView = ({ index }) => (
      <div
        ref={(c) => {
          views[index] = c
        }}
        style={{
          height: (index + 1) * 1000,
        }}
        data-testid={`Child ${index}`}
      >
        Child {index}
      </div>
    )

    const comp = render(
      <ViewSlider
        fillParent
        keepViewsMounted
        numViews={3}
        renderView={renderView}
        activeView={0}
      />
    )
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist

    views[2].parentElement.parentElement.scrollTop = 800
    expect(views[2].parentElement.parentElement.scrollTop).to.equal(800)
    comp.rerender(
      <ViewSlider
        fillParent
        keepViewsMounted
        numViews={3}
        renderView={renderView}
        activeView={2}
      />
    )
    expect(views[2].parentElement.parentElement.scrollTop).to.equal(0)
  })
})

describe('SimpleViewSlider', () => {
  it('single transition works', async () => {
    const comp = render(
      <SimpleViewSlider>
        <div key={0} data-testid="Child 0">
          Child 0
        </div>
      </SimpleViewSlider>
    )

    expect(comp.queryByTestId('Child 0')).to.exist

    comp.rerender(
      <SimpleViewSlider>
        <div key={1} data-testid="Child 1">
          Child 1
        </div>
      </SimpleViewSlider>
    )
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist

    await await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).not.to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
  })
  it('keepViewsMounted works', async () => {
    const comp = render(
      <SimpleViewSlider keepViewsMounted>
        <div key={0} data-testid="Child 0">
          Child 0
        </div>
      </SimpleViewSlider>
    )
    expect(comp.queryByTestId('Child 0')).to.exist

    comp.rerender(
      <SimpleViewSlider keepViewsMounted>
        <div key={1} data-testid="Child 1">
          Child 1
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist

    comp.rerender(
      <SimpleViewSlider keepViewsMounted>
        <div key={2} data-testid="Child 2">
          Child 2
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist

    comp.rerender(
      <SimpleViewSlider keepViewsMounted>
        <div key={1} data-testid="Child 1a">
          Child a
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).not.to.exist
    expect(comp.queryByTestId('Child 1a')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist
  })
  it('keepPrecedingViewsMounted works', async () => {
    const comp = render(
      <SimpleViewSlider keepPrecedingViewsMounted>
        <div key={0} data-testid="Child 0">
          Child 0
        </div>
      </SimpleViewSlider>
    )
    expect(comp.queryByTestId('Child 0')).to.exist

    comp.rerender(
      <SimpleViewSlider keepPrecedingViewsMounted>
        <div key={1} data-testid="Child 1">
          Child 1
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist

    comp.rerender(
      <SimpleViewSlider keepPrecedingViewsMounted>
        <div key={2} data-testid="Child 2">
          Child 2
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist

    comp.rerender(
      <SimpleViewSlider keepPrecedingViewsMounted>
        <div key={1} data-testid="Child 1">
          Child 1
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(200)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).not.to.exist
  })
  it('changing keepPrecedingViewsMounted works', async () => {
    const comp = render(
      <SimpleViewSlider keepViewsMounted>
        <div key={0} data-testid="Child 0">
          Child 0
        </div>
      </SimpleViewSlider>
    )

    expect(comp.queryByTestId('Child 0')).to.exist

    comp.rerender(
      <SimpleViewSlider keepViewsMounted>
        <div key={1} data-testid="Child 1">
          Child 1
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist

    comp.rerender(
      <SimpleViewSlider keepViewsMounted>
        <div key={2} data-testid="Child 2">
          Child 2
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).to.exist
    expect(comp.queryByTestId('Child 2')).to.exist

    comp.rerender(
      <SimpleViewSlider keepPrecedingViewsMounted>
        <div key={1} data-testid="Child 1a">
          Child 1a
        </div>
      </SimpleViewSlider>
    )

    await clock.tickAsync(1000)
    expect(comp.queryByTestId('Child 0')).to.exist
    expect(comp.queryByTestId('Child 1')).not.to.exist
    expect(comp.queryByTestId('Child 1a')).to.exist
    expect(comp.queryByTestId('Child 2')).not.to.exist
  })
})
