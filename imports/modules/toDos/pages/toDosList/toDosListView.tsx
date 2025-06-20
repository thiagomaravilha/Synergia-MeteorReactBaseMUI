import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox,
  Dialog
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ToDosListControllerContext } from './toDosListController';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import ToDosListStyles from './toDosListStyles';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import { ToDosModuleContext } from '../../toDosContainer';
import ToDosDetailController from '../toDosDetail/toDosDetailController';

const ToDosListView = () => {
  const controller = React.useContext(ToDosListControllerContext);
  const sysLayoutContext = React.useContext(AppLayoutContext);

  const { Container, LoadingContainer } = ToDosListStyles;

  if (controller.loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress />
          <Typography variant="body1">Aguarde, carregando tarefas...</Typography>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5">Lista de Tarefas</Typography>
      <List sx={{ width: '100%' }}>
        {controller.todoList.map((task) => (
          <ListItem
            key={task._id}
            button
            onClick={() => task._id && controller.onItemClick(task._id)}
            secondaryAction={
              <>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    controller.onToggleCheck(task);
                  }}
                >
                  <Checkbox checked={task.concluido} />
                </IconButton>

                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    if (task._id) {
                      controller.onEditButtonClick(task._id);
                    }
                  }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    DeleteDialog({
                      showDialog: sysLayoutContext.showDialog,
                      closeDialog: sysLayoutContext.closeDialog,
                      title: 'Excluir tarefa',
                      message: `Deseja excluir a tarefa "${task.descricao}"?`,
                      
                      onDeleteConfirm: () => {
                        controller.onDeleteButtonClick(task);
                      }
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              primary={task.descricao}
              secondary={`Criado por: ${task.nomeUsuario ?? 'Desconhecido'}`}
              primaryTypographyProps={{
                style: task.concluido ? { textDecoration: 'line-through', color: 'gray' } : {}
              }}
            />
          </ListItem>
        ))}
      </List>

      <SysFab
        variant="extended"
        text="Adicionar"
        startIcon={<SysIcon name="add" />}
        fixed
        onClick={controller.onAddButtonClick}
      />

      <Dialog
        open={controller.isModalOpen}
        onClose={controller.onCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <ToDosModuleContext.Provider
          value={{
            state: controller.modalState,
            id: controller.selectedTaskId || ''
          }}
        >
          <ToDosDetailController />
        </ToDosModuleContext.Provider>
      </Dialog>
    </Container>
  );
};

export default ToDosListView;
