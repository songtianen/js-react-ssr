export const topicDetailStyle = (theme) => {
  return {
    header: {
      padding: 20,
      borderBottom: '1px solid #dfdfdf',
      '& h3': {
        margin: 0,
      },
    },
    body: {
      padding: 20,
      '& img': {
        maxWidth: '100%',
      },
      '& ul, & ol': {
        paddingLeft: 30,
        '& li': {
          marginBottom: 7,
        },
      },
    },
    replyHeader: {
      padding: '10px 20px',
      backgroundColor: theme.palette.primary[500],
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
    },
    replyBody: {
      padding: 20,
    },
    replies: {
      margin: '0 24px',
      marginBottom: 24,
    },
    notLoginButton: {
      textAlign: 'center',
      padding: '20px 0',
    },
    '@media screen and (max-width: 480px)': {
      replies: {
        margin: '0 10px',
        marginBottom: 24,
      },
    },
    replyEditor: {
      position: 'relative',
      padding: 24,
      borderBottom: '1px solid #dfdfdf',
      '& .CodeMirror': {
        height: 150,
        minHeight: 'auto',
        '& .CodeMirror-scroll': {
          minHeight: 'auto',
        },
      },
    },
    replyButton: {
      position: 'absolute',
      right: 40,
      bottom: 65,
      zIndex: 101,
      opacity: 0.1,
      transition: 'opacity .3s',
      '&:hover': {
        opacity: 1,
      },
    },
    loadingContainer: {
      padding: 40,
      display: 'flex',
      justifyContent: 'space-around',
    },
    // ---------
    markedStyle: {
      backgroundColor: '#fff',
      '& ul': {
        margin: '10px 20px',
        listStyleType: 'square',
        padding: 0,
      },
      '& ol': {
        margin: '10px 20px',
        listStyleType: 'decimal',
        padding: 0,
      },
      '& li': {
        display: 'list - item',
        padding: 0,
      },
      '& hr': {
        margin: '15px 0',
        borderTop: '1px solid #eeeff1',
      },
      '& pre': {
        display: 'block',
        margin: '10px 0',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: '#f2f2f2',
        color: '#656565',
        fontSize: '14px',
      },
      '& blockquote': {
        display: 'block',
        borderLeft: '4px solid #ddd',
        margin: '15px 0',
        padding: '0 15px',
      },
      '& img': {
        margin: '20px 0',
      },
      '& a': {
        color: '#41b883',
        '&:hover': {
          color: '#ff0000',
        },
      },
      '& table': {
        border: '1px solid #eee',
        borderCollapse: 'collapse',
      },
      '& tr': {
        border: '1px solid #eee',
      },
      '& th': {
        padding: '8px 30px',
        borderRight: '1px solid #eee',
        backgroundColor: '#f2f2f2',
      },
      '& td': {
        padding: '8px 30px',
        borderRight: '1px solid #eee',
      },
      '& ::selection': {
        backgroundColor: theme.palette.secondary[100],
      },
    },
  }
}

export const replyStyle = {
  replyRoot: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 20,
    paddingBottom: 0,
    borderBottom: '1px solid #dfdfdf',
  },
  left: {
    marginRight: 20,
  },
  right: {
    '& img': {
      maxWidth: '100%',
      display: 'block',
    },
  },
}
export const MarkedStyles = (theme) => {
  return {
    markedStyle: {
      backgroundColor: theme.palette.secondary[500],
      '& ul': {
        margin: '10px 20px',
        listStyleType: 'square',
        padding: 0,
      },
      '& ol': {
        margin: '10px 20px',
        listStyleType: 'decimal',
        padding: 0,
      },
      '& li': {
        display: 'list - item',
        padding: 0,
      },
      '& hr': {
        margin: '15px 0',
        borderTop: '1px solid #eeeff1',
      },
      '& pre': {
        display: 'block',
        width: 600,
        margin: '10px 0',
        padding: '8px',
        borderRadius: '4px',
        backgroundColor: '#f2f2f2',
        color: '#656565',
        fontSize: '14px',
      },
      '& blockquote': {
        display: 'block',
        borderLeft: '4px solid #ddd',
        margin: '15px 0',
        padding: '0 15px',
      },
      '& img': {
        margin: '20px 0',
      },
      '& a': {
        color: '#41b883',
      },
      '& table': {
        border: '1px solid #eee',
        borderCollapse: 'collapse',
      },
      '& tr': {
        border: '1px solid #eee',
      },
      '& th': {
        padding: '8px 30px',
        borderRight: '1px solid #eee',
        backgroundColor: '#f2f2f2',
      },
      '& td': {
        padding: '8px 30px',
        borderRight: '1px solid #eee',
      },
    },
  }
}
