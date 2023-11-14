import * as React from 'react'
import { Prefix } from 'inline-style-prefixer'
import BaseViewSlider, { ViewProps } from '.'

export type SimpleViewSliderProps = {
  children?: any
  keepViewsMounted?: boolean | null
  keepPrecedingViewsMounted?: boolean | null
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
  rootRef?: React.Ref<HTMLDivElement>
  viewportRef?: React.Ref<HTMLDivElement>
  rtl?: boolean | null
  spacing?: number | null
}

export function createSimpleViewSlider(
  ViewSlider: typeof BaseViewSlider,
  renderView?: (props: ViewProps) => React.ReactNode
): React.ComponentType<SimpleViewSliderProps>

declare const SimpleViewSlider: React.ComponentType<SimpleViewSliderProps>
export default SimpleViewSlider
