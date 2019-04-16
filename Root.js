import * as React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import SignupDemo from './examples/SignupDemo'
import Typography from '@material-ui/core/Typography'

const styles = {
  root: {
    margin: '0 auto',
    maxWidth: 600,
  },
}

const Root = ({ classes }) => (
  <div className={classes.root}>
    <Typography variant="h4">react-view-slider demo</Typography>
    <SignupDemo />
  </div>
)

export default withStyles(styles)(Root)
