import React, { useContext } from 'react';
import { ToDosDetailControllerContext } from './toDosDetailController';
import { ToDosModuleContext } from '../../toDosContainer';
import ToDosDetailStyles from './toDosDetailStyles';
import SysForm from '/imports/ui/components/sysForm/sysForm';
import SysTextField from '/imports/ui/components/sysFormFields/sysTextField/sysTextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SysFormButton from '/imports/ui/components/sysFormFields/sysFormButton/sysFormButton';
import { SysCheckBox } from '/imports/ui/components/sysFormFields/sysCheckBoxField/sysCheckBoxField';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import { Box, CircularProgress } from '@mui/material';
import { SysSelectField } from '/imports/ui/components/sysFormFields/sysSelectField/sysSelectField';

const ToDosDetailView = () => {
  const controller = useContext(ToDosDetailControllerContext);
  const { state } = useContext(ToDosModuleContext);
  const isView = state === 'view';
  const isEdit = state === 'edit';
  const isCreate = state === 'create';

  const { Container, Body, Header, Footer, FormColumn } = ToDosDetailStyles;

  if (controller.loading || !controller.document) {
    return (
      <Box p={4} display="flex" flexDirection="column" alignItems="center">
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Carregando tarefa...
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Header>
        {isView && (
          <IconButton onClick={controller.closePage}>
            <SysIcon name={'arrowBack'} />
          </IconButton>
        )}
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          {isCreate
            ? 'Adicionar Tarefa'
            : isEdit
            ? 'Editar Tarefa'
            : controller.document?.nome ?? 'Visualizar Tarefa'}
        </Typography>
        <IconButton onClick={controller.closePage}>
          <SysIcon name="close" />
        </IconButton>
      </Header>

      <SysForm
        mode={state as 'create' | 'view' | 'edit'}
        schema={controller.schema}
        doc={controller.document}
        onSubmit={controller.onSubmit}
        loading={controller.loading}
      >
        <Body>
          <FormColumn>
            <SysTextField
              name="nome"
              label="Nome da tarefa"
              placeholder="Dê um nome para a tarefa"
              max={100}
              showNumberCharactersTyped
            />
            <SysTextField
              name="descricao"
              label="Descrição"
              placeholder="Descreva a tarefa"
              multiline
              rows={3}
              maxRows={3}
              max={200}
              showNumberCharactersTyped
            />
            <SysCheckBox
              name="concluido"
              label="Tarefa concluída?"
              disabled={isCreate}
            />
            <SysSelectField
              name="tipo"
              label="Tipo da Tarefa"
              options={[
                { value: 'Pública', label: 'Pública' },
                { value: 'Pessoal', label: 'Pessoal' }
              ]}
              disabled={isView}
            />
          </FormColumn>
        </Body>
        <Footer>
          {!isView && (
            <Button
              variant="outlined"
              startIcon={<SysIcon name={'close'} />}
              onClick={controller.closePage}
            >
              Cancelar
            </Button>
          )}
          <SysFormButton>Salvar</SysFormButton>
        </Footer>
      </SysForm>
    </Container>
  );
};

export default ToDosDetailView;
