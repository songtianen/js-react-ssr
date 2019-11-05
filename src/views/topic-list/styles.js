export const ToppcPrimaryStyle = (theme) => {
  return {
    ToppcPrimaryRoot: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      color: '#555',
    },
    tab: {
      backgroundColor: theme.palette.secondary[500],
      textAlign: 'center',
      display: 'inline-block',
      padding: '0 6px',
      color: '#fff',
      borderRadius: 3,
      marginRight: 10,
      fontSize: '15px',
    },
    top: {
      backgroundColor: theme.palette.primary[900],
    },
    point: {
      display: 'inline-block',
      width: 8,
      height: 8,
      marginRight: 4,
      backgroundColor: theme.palette.primary[500],
      borderRadius: '50%',
    },
  }
}

export const SecondaryStyle = (theme) => {
  return {
    SecondaryRoot: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: 3,
      color: '#999',
      border: 'solid red 1px',
    },
    count: {
      textAlign: 'center',
      marginRight: '20px',
      border: 'solid red 1px',
    },
    username: {
      marginRight: 20,
      border: 'solid red 1px',
    },
    accentColor: {
      color: theme.palette.secondary[500],
    },
  }
}

