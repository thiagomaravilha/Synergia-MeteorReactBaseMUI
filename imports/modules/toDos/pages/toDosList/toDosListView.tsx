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
  Button,
  Menu,
  MenuItem,
  alpha
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { ToDosListControllerContext } from './toDosListController';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { SysFab } from '/imports/ui/components/sysFab/sysFab';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import ToDosListStyles from './toDosListStyles';
import DeleteDialog from '/imports/ui/appComponents/showDialog/custom/deleteDialog/deleteDialog';
import { ToDosModuleContext } from '../../toDosContainer';
import ToDosDetailController from '../toDosDetail/toDosDetailController';
import { IToDos } from '../../api/toDosSch';

const ToDosListView = () => {
  const controller = React.useContext(ToDosListControllerContext);
  const sysLayoutContext = React.useContext(AppLayoutContext);

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedMenuId, setSelectedMenuId] = React.useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuId(taskId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMenuId(null);
  };

  const { Container, LoadingContainer, ShowMoreButtonContainer, ListsWrapper, ListColumn, ColumnHeader } = ToDosListStyles;
  const INITIAL_VISIBLE_COUNT = 4;

  if (controller.loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
        <Typography variant="body1">Aguarde, carregando tarefas...</Typography>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Typography variant="h5">Lista de Tarefas</Typography>

      <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
        <SysTextField
          name="search"
          placeholder="Pesquisar por descrição..."
          value={controller.searchInput}
          onChange={(e) => controller.setSearchInput(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && controller.onSearch()}
          sxMap={{ textField: { width: '100%' } }}
        />
        <Button variant="contained" onClick={controller.onSearch} sx={{ whiteSpace: 'nowrap' }}>
          Pesquisar
        </Button>
        {controller.hasSearched && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={controller.onClearSearch}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Limpar busca
          </Button>
        )}
      </Stack>

      <ListsWrapper>
        
        <ListColumn>
          <ColumnHeader>
            <Typography variant="h6">Não Concluídas ({controller.totalNaoConcluidas})</Typography>
          </ColumnHeader>
          <List sx={{ width: '100%', p: 0 }}>
            {controller.naoConcluidas.length > 0 ? (
              controller.naoConcluidas.map(renderListItem)
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontStyle: 'italic', textAlign: 'center' }}>Nenhuma tarefa pendente.</Typography>
            )}
          </List>
          {controller.canShowMoreNaoConcluidas ? (
            <ShowMoreButtonContainer>
              <Button variant="text" onClick={controller.onShowMoreNaoConcluidas}>
                Mostrar mais
              </Button>
            </ShowMoreButtonContainer>
          ) : controller.showAllNaoConcluidas && controller.totalNaoConcluidas > INITIAL_VISIBLE_COUNT ? (
            <ShowMoreButtonContainer>
              <Button variant="text" onClick={controller.onShowLessNaoConcluidas}>
                Mostrar menos
              </Button>
            </ShowMoreButtonContainer>
          ) : null}
        </ListColumn>

        <ListColumn>
          <ColumnHeader>
            <Typography variant="h6">Concluídas ({controller.totalConcluidas})</Typography>
          </ColumnHeader>
          <List sx={{ width: '100%', p: 0 }}>
            {controller.concluidas.length > 0 ? (
              controller.concluidas.map(renderListItem)
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontStyle: 'italic', textAlign: 'center' }}>Nenhuma tarefa concluída.</Typography>
            )}
          </List>
          {controller.canShowMoreConcluidas ? (
            <ShowMoreButtonContainer>
              <Button variant="text" onClick={controller.onShowMoreConcluidas}>
                Mostrar mais
              </Button>
            </ShowMoreButtonContainer>
          ) : controller.showAllConcluidas && controller.totalConcluidas > INITIAL_VISIBLE_COUNT ? (
            <ShowMoreButtonContainer>
              <Button variant="text" onClick={controller.onShowLessConcluidas}>
                Mostrar menos
              </Button>
            </ShowMoreButtonContainer>
          ) : null}
        </ListColumn>
      </ListsWrapper>

      <SysFab variant="extended" text="Adicionar Tarefa" startIcon={<SysIcon name="add" />} fixed onClick={controller.onAddButtonClick} />

      <Dialog open={controller.isModalOpen} onClose={controller.onCloseModal} fullWidth maxWidth="sm">
        <ToDosModuleContext.Provider value={{ state: controller.modalState, id: controller.selectedTaskId || '' }}>
          <ToDosDetailController />
        </ToDosModuleContext.Provider>
      </Dialog>
    </Container>
  );

  function renderListItem(task: IToDos & { nomeUsuario?: string }) {
    return (
      <ListItem
        key={task._id}
        button
        onClick={() => task._id && controller.onItemClick(task._id)}
        divider
        sx={{
          borderRadius: 1,
          '&:hover': {
             // ALTERAÇÃO AQUI: Trocado 'action.hover' por 'primary.main' com baixa opacidade
             backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
          },
          mb: 0.5, // Adiciona um pequeno espaçamento entre os itens
        }}
        secondaryAction={(
          <>
            <IconButton aria-label="Opções" onClick={(event) => task._id && handleMenuOpen(event, task._id)}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={selectedMenuId === task._id} onClose={handleMenuClose} onClick={(e) => e.stopPropagation()}>
              <MenuItem onClick={() => { if (task._id) controller.onEditButtonClick(task._id); handleMenuClose(); }}>
                <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                handleMenuClose();
                DeleteDialog({
                  showDialog: sysLayoutContext.showDialog,
                  closeDialog: sysLayoutContext.closeDialog,
                  title: 'Excluir tarefa',
                  message: `Deseja realmente excluir a tarefa "${task.nome}"? Esta ação não pode ser desfeita.`,
                  onDeleteConfirm: () => controller.onDeleteButtonClick(task)
                });
              }}>
                <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Excluir</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={!!task.concluido}
            tabIndex={-1}
            disableRipple
            onClick={(event) => { event.stopPropagation(); controller.onToggleCheck(task); }}
          />
        </ListItemIcon>
        <ListItemText
          primary={(
            <Box display="flex" alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 500, textDecoration: task.concluido ? 'line-through' : 'none', color: task.concluido ? 'text.disabled' : 'text.primary' }}>
                {task.nome}
              </Typography>
              {task.tipo === 'Pessoal' && (
                <Tooltip title="Tarefa pessoal">
                  <LockIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
                </Tooltip>
              )}
            </Box>
          )}
          secondary={(
            <>
              {task.nomeUsuario && (
                <Typography component="span" variant="caption" sx={{ display: 'block', fontStyle: 'italic', color: 'text.secondary' }}>
                  {`Criado por: ${task.nomeUsuario}`}
                </Typography>
              )}
            </>
          )}
        />
      </ListItem>
    );
  }
};

export default ToDosListView;