import React from 'react';
import { ISysTemplateProps } from '../getTemplate';
import { BoxProps, Typography } from '@mui/material';
import TemplateAppBarStyles from './templateAppBarStyles';
import SysAppBar from '../components/sysAppBar/sysAppBarController';

export interface ITemplateAppBar extends ISysTemplateProps {
  containerProps?: BoxProps;
  logo?: React.ReactNode;
}

export const TemplateAppBar: React.FC<ITemplateAppBar> = ({
  children,
  menuOptions,
  logo,
  containerProps
}) => {
  return (
    <TemplateAppBarStyles.container>
      <SysAppBar logo={logo ?? <BoilerplateLogo />} menuOptions={menuOptions} />
      <TemplateAppBarStyles.contentWrapper>
        <TemplateAppBarStyles.contentContainer {...containerProps}>
          {children}
        </TemplateAppBarStyles.contentContainer>
      </TemplateAppBarStyles.contentWrapper>
    </TemplateAppBarStyles.container>
  );
};

const BoilerplateLogo: React.FC = () => {
  return (
    <Typography
      variant="subtitle1"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 'bold',
        color: (theme) => theme.palette.primary.light
      }}
    >
      {'{ '}
      <Typography
        variant="inherit"
        sx={{
          color: (theme) => theme.palette.sysText?.baseContrast
        }}
      >
        Lista de Tarefas
      </Typography>{' '}
      {'}'}
    </Typography>
  );
};
