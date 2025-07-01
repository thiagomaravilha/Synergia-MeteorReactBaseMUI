import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

interface ISignInStyles {
	Container: React.ElementType;
	Content: React.ElementType;
	FormContainer: React.ElementType;
	FormWrapper: React.ElementType;
}

const SignInStyles: ISignInStyles = {
	Container: styled(Box)(({ theme }) => ({
		minHeight: '100vh',
		width: '100%',
		background: `linear-gradient(to bottom, ${theme.palette.primary.light}, ${theme.palette.sysBackground?.default})`,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing(4),
	})),
	Content: styled(Box)(({ theme }) => ({
		width: '100%',
		maxWidth: '400px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: theme.spacing(4),
		color: theme.palette.text.primary,
		textAlign: 'center',
	})),
	FormContainer: styled(Box)(({ theme }) => ({
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(4),
		borderRadius: theme.shape.borderRadius * 2,
		boxShadow: theme.shadows[3],
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(3),
	})),
	FormWrapper: styled(Box)(({ theme }) => ({
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		gap: theme.spacing(2),
	}))
};

export default SignInStyles;
