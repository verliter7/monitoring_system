const styleObject = {
  center_flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsis: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  scroll: (axis?: 'X' | 'Y') => ({
    [`overflow${axis ? `${axis}` : ''}`]: 'auto',
    '&::-webkit-scrollbar': {
      height: '7px',
      width: '6px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: '#8d8d8d',
    },

    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#7a7a7a',
    },

    '&::-webkit-scrollbar-track-piece': {
      borderRadius: '10px',
      backgroundColor: '#ffffff',
    },
  }),
};

export default styleObject;
