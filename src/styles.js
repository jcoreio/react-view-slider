// @flow

const fill = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

const styles = {
  viewport: {
    whiteSpace: 'nowrap',
    minHeight: '100%',
  },
  page: {
    position: 'relative',
    display: 'inline-block',
    verticalAlign: 'top',
    whiteSpace: 'normal',
    width: '100%',
  },
  fillParent: {},
  root: {
    overflow: 'hidden',
    '&$fillParent': {
      ...fill,
      '& > $viewport': {
        ...fill,
        '& $page ': {
          ...fill,
          overflow: 'auto',
        },
      },
    },
  },
}

export default styles

