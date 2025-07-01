import { ElementType } from 'react';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';
import List, { ListProps } from '@mui/material/List';
import ListItem, { ListItemProps } from '@mui/material/ListItem';
import { SysSectionPaddingXY } from "/imports/ui/layoutComponents/sysLayoutComponents";

interface IHomeStyles {
	Container: ElementType<BoxProps>;
	Header: ElementType<BoxProps>;
	RowButtons: ElementType<BoxProps>;
	// Novos componentes de estilo
	RecentTasksSection: ElementType<BoxProps>;
	TaskList: ElementType<ListProps>;
	TaskItem: ElementType<ListItemProps>;
	LoadingContainer: ElementType<BoxProps>;
}

const HomeStyles: IHomeStyles = {
	Container: styled(SysSectionPaddingXY)(() => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		gap: '2.5rem',
		width: '100%',
	})),
	Header: styled(Box)(({}) => ({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		gap: '1rem',
		width: '100%'
	})),
	RowButtons: styled(Box)(({ theme }) => ({
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: '0.5rem',
		flexWrap: 'wrap',
		rowGap: '0.8rem',
		[theme.breakpoints.down('lg')]: {
			justifyContent: 'space-around'
		},
		[theme.breakpoints.down('sm')]: {
			columnGap: '1rem'
		}
	})),

	// #region Novos Estilos
	RecentTasksSection: styled(Box)({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
	}),

	TaskList: styled(List)(({ theme }) => ({
		width: '100%',
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: theme.shape.borderRadius,
		padding: 0,
		backgroundColor: theme.palette.background.paper,
	})),

	TaskItem: styled(ListItem)(({}) => ({
		paddingTop: '12px',
		paddingBottom: '12px',
	})),

	LoadingContainer: styled(Box)({
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		minHeight: '150px',
		border: `1px solid transparent`, // Para manter o mesmo espaço da lista
	}),
	// #endregion
};

export default HomeStyles;