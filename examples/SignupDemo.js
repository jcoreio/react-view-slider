/**
 * @flow
 * @prettier
 */

import * as React from 'react'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import ViewSlider from '../../src/simple'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ArrowForward from '@material-ui/icons/ArrowForward'
import withStyles from '@material-ui/core/styles/withStyles'
import { useAutofocusRef } from 'react-transition-context'

type Classes = $Call<
  <T>((theme: any) => T) => $ObjMap<T, () => string>,
  typeof styles
>

export type Props = {
  classes: Classes,
}

const styles = (theme: any) => ({
  root: {
    margin: '32px auto',
  },
  contentHolder: {},
  backButton: {
    marginTop: 32,
    marginBottom: 8,
  },
  paper: {},
  form: {
    margin: 32,
    [theme.breakpoints.down('xs')]: {
      margin: 16,
    },
    '& button[type="submit"]': {
      alignSelf: 'flex-start',
      marginTop: 32,
    },
  },
  h5: {
    marginBottom: 32,
    '& > em': {
      fontStyle: 'initial',
      fontWeight: 'bold',
      color: theme.palette.primary.main,
    },
  },
})

const SignupDemo = ({ classes }: Props): React.Node => {
  const [step, setStep] = React.useState(0)
  let content
  const Step = steps[step]
  if (Step) {
    content = (
      <Step
        key={step}
        classes={classes}
        onSubmit={(e: Event) => {
          e.preventDefault()
          setStep(step + 1)
        }}
      />
    )
  }
  return (
    <div className={classes.root}>
      <Typography variant="h6">Signup Form Example</Typography>
      <Button
        className={classes.backButton}
        onClick={() => setStep(step - 1)}
        disabled={step <= 0}
      >
        <ArrowBack /> Back
      </Button>
      <div className={classes.contentHolder}>
        <Paper className={classes.paper}>
          <ViewSlider animateHeight spacing={1.2}>
            {content}
          </ViewSlider>
        </Paper>
      </div>
    </div>
  )
}

export default withStyles(styles)(SignupDemo)

type FormProps = {
  classes: Classes,
  onSubmit: (e: Event) => any,
}

const EmailForm = ({ classes, onSubmit }: FormProps): React.Node => {
  const autofocusRef = useAutofocusRef()
  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Typography variant="h5" className={classes.h5}>
        <em>Welcome,</em> enter your email address to get started.
      </Typography>
      <TextField
        inputRef={autofocusRef}
        type="text"
        name="email"
        placeholder="Enter email address"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Get Started <ArrowForward />
      </Button>
    </form>
  )
}

const VerificationCodeForm = ({ classes, onSubmit }: FormProps): React.Node => {
  const autofocusRef = useAutofocusRef()
  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Typography variant="h5" className={classes.h5}>
        <em>Next,</em> enter the code we sent to you.
      </Typography>
      <TextField
        inputRef={autofocusRef}
        type="text"
        name="verificationCode"
        label="Verification Code"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Verify
      </Button>
    </form>
  )
}

const OrganizationForm = ({ classes, onSubmit }: FormProps): React.Node => {
  const autofocusRef = useAutofocusRef()
  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Typography variant="h5" className={classes.h5}>
        <em>Success!</em> Next, set up your organization.
      </Typography>
      <TextField
        inputRef={autofocusRef}
        type="text"
        name="name"
        label="Organization Code"
        fullWidth
      />
      <TextField
        type="text"
        name="displayName"
        label="Organization Name"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Continue <ArrowForward />
      </Button>
    </form>
  )
}

const PasswordForm = ({ classes, onSubmit }: FormProps): React.Node => {
  const autofocusRef = useAutofocusRef()
  return (
    <form className={classes.form} onSubmit={onSubmit}>
      <Typography variant="h5" className={classes.h5}>
        <em>Almost Done!</em> Finally, create a password.
      </Typography>
      <TextField
        inputRef={autofocusRef}
        type="password"
        name="password"
        label="Password"
        fullWidth
      />
      <TextField
        type="password"
        name="retypePassword"
        label="Retype Password"
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary">
        Finish <ArrowForward />
      </Button>
    </form>
  )
}

const DoneForm = ({ classes, onSubmit }: FormProps): React.Node => (
  <div className={classes.form}>
    <Typography variant="h5" className={classes.h5}>
      <em>Thank you</em> for viewing the demo!
    </Typography>
    <Typography variant="h6">Additional libraries to check out:</Typography>
    <Typography variant="h5">
      <Link href="https://github.com/jcoreio/react-router-drilldown">
        <code>react-router-drilldown</code>
      </Link>
    </Typography>
    <Typography variant="body1" component="p">
      uses <code>react-view-slider</code> to animate transitions between routes
      in <code>react-router</code>.
    </Typography>
    <Typography variant="h5">
      <Link href="https://github.com/jcoreio/react-fader">
        <code>react-fader</code>
      </Link>
    </Typography>
    <Typography variant="body1" component="p">
      component that fades out its old child, then fades in its new child when
      its children change. It can also optionally animate its height and/or
      width from one child{"'"}s size to the other. Also works well with{' '}
      <code>react-router</code>!
    </Typography>
    <Typography variant="h5">
      <Link href="https://github.com/jcoreio/react-transition-context">
        <code>react-transition-context</code>
      </Link>
    </Typography>
    <Typography variant="body1" component="p">
      Allows you to perform effects when transitions in an ancestor component
      start or end (used to automatically focus the inputs in this demo). Also
      works with <code>react-router-drilldown</code> and{' '}
      <code>react-fader</code>!
    </Typography>
  </div>
)

const steps = [
  EmailForm,
  VerificationCodeForm,
  OrganizationForm,
  PasswordForm,
  DoneForm,
]
