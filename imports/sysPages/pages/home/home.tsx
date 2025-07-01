import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

// Imports do Material-UI
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

// Imports de componentes e APIs do projeto
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import HomeStyles from './homeStyle';
import { toDosApi } from '/imports/modules/toDos/api/toDosApi';
import { IToDos } from '/imports/modules/toDos/api/toDosSch';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const { Container, Header, RecentTasksSection, TaskList, TaskItem, LoadingContainer } = HomeStyles;

	// Hook para buscar dados reativamente do servidor
	const { user, recentToDos, loading } = useTracker(() => {
		const subHandle = toDosApi.subscribe('toDosRecent');
		const isLoading = !subHandle || !subHandle.ready();
		const tasks = toDosApi.find({}, { sort: { createdat: -1 } }).fetch();
		const currentUser = Meteor.user();

		return {
			user: currentUser,
			recentToDos: tasks as (IToDos & { nomeUsuario?: string })[],
			loading: isLoading
		};
	}, []);

	const renderTaskList = () => {
		if (loading) {
			return (
				<LoadingContainer>
					<CircularProgress />
					<Typography variant="body1" sx={{ mt: 2 }}>
						Carregando atividades...
					</Typography>
				</LoadingContainer>
			);
		}

		if (recentToDos.length === 0) {
			return (
				<Typography variant="body2" color="text.secondary" sx={{ p: 2, fontStyle: 'italic', textAlign: 'center' }}>
					Nenhuma atividade recente para mostrar.
				</Typography>
			);
		}

		return (
			<TaskList>
				{recentToDos.map((task) => (
					// O ListItemIcon com o Checkbox foi removido daqui
					<TaskItem key={task._id} divider>
						<ListItemText
                            primary={
                                <Typography sx={{ textDecoration: task.concluido ? 'line-through' : 'none', color: task.concluido ? 'text.disabled' : 'text.primary' }}>
                                    {task.nome}
                                </Typography>
                            }
							secondary={`Criada por: ${task.nomeUsuario || 'Desconhecido'}`}
						/>
					</TaskItem>
				))}
			</TaskList>
		);
	};

	return (
		<Container>
			<Header>
				{/* O nome do usuário é pego dinamicamente */}
				<Typography variant="h3">Olá, {user?.username || ''}</Typography>
				<Typography variant="body1">
					Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu time, por você e para você!
				</Typography>
			</Header>

			{/* Nova seção para as tarefas recentes */}
			<RecentTasksSection>
				<Typography variant="h5" gutterBottom>
					Atividades recentes
				</Typography>
				{renderTaskList()}
			</RecentTasksSection>

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