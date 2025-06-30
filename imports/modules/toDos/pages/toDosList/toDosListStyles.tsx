import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import { sysSizing } from '/imports/ui/materialui/styles';
import { SysSectionPaddingXY } from '/imports/ui/layoutComponents/sysLayoutComponents';

interface IToDosListStyles {
  Container: ElementType<BoxProps>;
  LoadingContainer: ElementType<BoxProps>;
  ShowMoreButtonContainer: ElementType<BoxProps>;
}

const ToDosListStyles: IToDosListStyles = {
  Container: styled(SysSectionPaddingXY)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    gap: theme.spacing(1),
    paddingBottom: sysSizing.contentFabDistance
  })),
  LoadingContainer: styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: theme.spacing(2),
    height: 'calc(100vh - 200px)'
  })),

  ShowMoreButtonContainer: styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(1, 0),
    marginTop: theme.spacing(1),
  })),
};

export default ToDosListStyles;