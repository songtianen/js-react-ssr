import React from 'react'
import PropTypes from 'prop-types'
import cln from 'classnames'
import { withStyles } from 'material-ui/styles'
import { ListItem, ListItemText } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import { ToppcPrimaryStyle, SecondaryStyle } from './styles'

const Primary = ({ classes, topic }) => {
  const classnames = cln({
    [classes.tab]: true,
    [classes.top]: topic.top,
  })
  return (
    <span className={classes.ToppcPrimaryRoot}>
      <span className={classnames}>
        <span className={classes.point} />
        {topic.top ? '置顶' : topic.tab}
      </span>
      <span className={classes.title}>{topic.title}</span>
    </span>
  )
}

const Secondary = ({ classes, topic }) => (
  <span className={classes.SecondaryRoot}>
    <span className={classes.username}>{topic.author.loginname}</span>
    <span className={classes.count}>
      <span className={classes.accentColor}>
        {topic.reply_count}
      </span>
      <span>/</span>
      <span>{topic.visit_count}</span>
    </span>
    <span>
      创建时间:{topic.create_at}
    </span>
  </span>
)

const PrimaryWithStyle = withStyles(ToppcPrimaryStyle)(Primary)
const SecondaryWithStyle = withStyles(SecondaryStyle)(Secondary)

const TopicListItem = ({ onClick, topic }) => (
  <ListItem button onClick={onClick}>
    <Avatar src={topic.author.avatar_url} />
    <ListItemText
      primary={<PrimaryWithStyle topic={topic} />}
      secondary={<SecondaryWithStyle topic={topic} />}
    />
  </ListItem>
)

Primary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}
Secondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}
TopicListItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  topic: PropTypes.object.isRequired,
}

export default TopicListItem

