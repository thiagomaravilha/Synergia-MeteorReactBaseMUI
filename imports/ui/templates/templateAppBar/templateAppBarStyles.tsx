import { ElementType } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { sysSizing } from '../../materialui/styles';

interface ITemplateAppBarStyles {
  container: ElementType<BoxProps>;
  contentWrapper: ElementType<BoxProps>;
  contentContainer: ElementType<BoxProps>;
}

const TemplateAppBarStyles: ITemplateAppBarStyles = {
  container: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4] || '0px 4px 10px rgba(0, 0, 0, 0.1)',
  })),

  contentWrapper: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    overflow: 'auto',
    backgroundColor: theme.palette.sysBackground?.bg1,
  })),

  contentContainer: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    maxWidth: sysSizing.maxDisplayWidth,
    padding: theme.spacing(2),
  })),
};

export default TemplateAppBarStyles;
