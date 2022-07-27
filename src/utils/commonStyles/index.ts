const styleObject = {
  center_flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: (axis?: 'x' | 'y') => ({
    [`overflow${axis ? `-${axis}` : ''}`]: 'auto',
    '&::-webkit-scrollbar': {
      height: '7px',
      width: '6px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '10px',
      backgroundColor: '#dadada',
    },

    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#bbbbbb',
    },

    '&::-webkit-scrollbar-track-piece': {
      borderRadius: '10px',
      backgroundColor: '#f7f7f9',
    },
  }),
};

export default styleObject;
