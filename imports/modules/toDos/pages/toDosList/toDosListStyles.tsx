import { ElementType } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import { sysSizing } from '/imports/ui/materialui/styles';
import { SysSectionPaddingXY } from '/imports/ui/layoutComponents/sysLayoutComponents';

interface IToDosListStyles {
  Container: ElementType<BoxProps>;
  LoadingContainer: ElementType<BoxProps>;
  ShowMoreButtonContainer: ElementType<BoxProps>;
  ListsWrapper: ElementType<BoxProps>;
  ListColumn: ElementType<BoxProps>;
  ColumnHeader: ElementType<BoxProps>;
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
    gap: theme.spacing(2), // Ajustado o espaçamento geral
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
    marginTop: theme.spacing(1)
  })),

  ListsWrapper: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.background.default, 0.4),
    overflow: 'hidden' // Para manter o borderRadius nos cantos
  })),

  ListColumn: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    flex: 1,
    padding: theme.spacing(2),
    '&:not(:last-of-type)': {
      borderRight: `1px solid ${theme.palette.divider}`
    }
  })),
  
  ColumnHeader: styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    width: '100%'
  }))
};

export default ToDosListStyles;