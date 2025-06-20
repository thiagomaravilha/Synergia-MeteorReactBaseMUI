import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import HomeStyles from './homeStyle';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const { Container, Header } = HomeStyles;

	return (
		<Container>
			<Header>
				<Typography variant="h3">Bem-vindo ao Sistema</Typography>
				<Typography variant="body1" textAlign="justify">
					Este é o início da sua jornada! Aqui você poderá gerenciar suas tarefas de forma simples e eficiente.
				</Typography>
			</Header>

			<Box>
				<Button
					variant="contained"
					startIcon={<SysIcon name="check" />}
					onClick={() => navigate('/toDos')}
				>
					Minhas Tarefas
				</Button>
			</Box>
		</Container>
	);
};

export default Home;
