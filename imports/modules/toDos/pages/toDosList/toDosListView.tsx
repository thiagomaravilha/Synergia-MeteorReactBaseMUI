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
  Dialog,
  Tooltip,
  Stack,
  Button
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';

import { ToDosListControllerContext } from './toDosListController';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
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

      <Stack direction="row" spacing={1} sx={{ mb: 2, width: '100%' }}>
        <SysTextField
          name="search"
          placeholder="Pesquisar por nome ou descrição"
          value={controller.searchInput}
          onChange={(e) => controller.setSearchInput(e.target.value)}
          sxMap={{ textField: { width: '100%' } }}
        />
        <Button
          variant="contained"
          onClick={controller.onSearch}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Pesquisar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={controller.onClearSearch}
          sx={{ whiteSpace: 'nowrap', minWidth: 200 }}
          disabled={!controller.hasSearched}
        >
          Mostrar lista completa
        </Button>


      </Stack>


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
                      message: `Deseja excluir a tarefa "${task.nome}"?`,
                      onDeleteConfirm: () => controller.onDeleteButtonClick(task)
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
              primary={
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: task.concluido ? 'line-through' : 'none',
                      color: task.concluido ? 'text.disabled' : 'text.primary',
                    }}
                  >
                    {task.nome}
                  </Typography>
                  {/* Lógica do ícone de cadeado atualizada para usar o campo 'tipo' */}
                  {task.tipo === 'Pessoal' && (
                    <Tooltip title="Tarefa pessoal">
                      <LockIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                    </Tooltip>
                  )}
                </Box>
              }
              secondary={
                <React.Fragment>
                  {task.descricao && (
                    <Typography
                      sx={{
                        display: 'block',
                        textDecoration: task.concluido ? 'line-through' : 'none',
                        color: task.concluido ? 'text.disabled' : 'text.secondary',
                      }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {task.descricao}
                    </Typography>
                  )}
                  <Typography component="span" variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'text.secondary' }}>
                    {`Criado por: ${task.nomeUsuario ?? 'Desconhecido'}`}
                  </Typography>
                </React.Fragment>
              }
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
