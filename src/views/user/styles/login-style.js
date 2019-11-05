const inputWidth = 300

export default () => {
  return {
    loginRoot: {
      padding: '60px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'pink',

    },
    input: {
      width: inputWidth,
      marginBottom: 20,
    },
    loginButton: {
      width: inputWidth,
    },
  }
}
