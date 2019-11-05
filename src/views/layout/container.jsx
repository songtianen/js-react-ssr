import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { withStyles } from 'material-ui/styles'
import { containerStyles } from './styles'

const Container = ({ children, classes }) => (
  <Paper className={classes.containerRoot}>{children}</Paper>
)

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
}
export default withStyles(containerStyles)(Container)
