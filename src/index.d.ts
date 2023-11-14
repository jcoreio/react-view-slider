import * as React from 'react'
import { TransitionState } from 'react-transition-context'
import { Prefix } from 'inline-style-prefixer'

export type ViewProps = {
  index: number
  active: boolean
  transitionState: TransitionState
}

export type ViewSliderProps = {
  activeView: number
  numViews: number
  renderView: (props: ViewProps) => React.ReactNode
  keepViewsMounted?: boolean | null
  animateHeight?: boolean | null
  transitionDuration?: number | null
  transitionTimingFunction?: string | null
  onSlideTransitionEnd?: (() => void) | null
  prefixer?: Prefix | null
  fillParent?: boolean | null
  className?: string | null
  style?: React.CSSProperties | null
  viewportClassName?: string | null
  viewportStyle?: React.CSSProperties | null
  viewStyle?: React.CSSProperties | null
  innerViewWrapperStyle?: React.CSSProperties | null
  rootRef?: React.Ref<HTMLDivElement> | null
  viewportRef?: React.Ref<HTMLDivElement> | null
  rtl?: boolean | null
  spacing?: number | null
}

declare const ViewSlider: React.ComponentType<ViewSliderProps>

export default ViewSlider
