import React, { createContext, useCallback, useContext } from 'react';
import ToDosDetailView from './toDosDetailView';
import { useNavigate } from 'react-router-dom';
import { ToDosModuleContext } from '../../toDosContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import { IToDos } from '../../api/toDosSch';
import { ISchema } from '/imports/typings/ISchema';
import { IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { ToDosListControllerContext } from '../toDosList/toDosListController';

interface IToDosDetailContollerContext {
  closePage: () => void;
  document: IToDos;
  loading: boolean;
  schema: ISchema<IToDos>;
  onSubmit: (doc: IToDos) => void;
  changeToEdit: (id: string) => void;
}

export const ToDosDetailControllerContext = createContext<IToDosDetailContollerContext>(
  {} as IToDosDetailContollerContext
);

const ToDosDetailController = () => {
  const navigate = useNavigate();
  const { id, state } = useContext(ToDosModuleContext);
  const listController = useContext(ToDosListControllerContext);
  const { showNotification } = useContext(AppLayoutContext);

  const { document, loading } = useTracker(() => {
    const subHandle = !!id ? toDosApi.subscribe('toDosDetail', { _id: id }) : null;
    const document = id && subHandle?.ready() ? toDosApi.findOne({ _id: id }) : {};
    return {
      document: (document as IToDos) ?? ({ _id: id } as IToDos),
      loading: !!subHandle && !subHandle?.ready()
    };
  }, [id]);

  const closePage = useCallback(() => {
    if (listController?.onCloseModal) {
      listController.onCloseModal();
    } else {
      navigate(-1);
    }
  }, [navigate, listController]);

  const changeToEdit = useCallback((id: string) => {
    navigate(`/toDos/edit/${id}`);
  }, []);

  const onSubmit = useCallback((doc: IToDos) => {
  const selectedAction = state === 'create' ? 'insert' : 'update';
  toDosApi[selectedAction](doc, (e: IMeteorError, res?: { message?: string }) => {
    if (!e) {
      closePage();
      showNotification({
        type: 'success',
        title: 'Operação realizada!',
        message: res?.message ?? 'Tarefa salva com sucesso!'
      });
    } else {
      showNotification({
        type: 'error',
        title: 'Erro na operação',
        message: e.reason || 'Erro desconhecido'
      });
    }
  });
}, [state, closePage, showNotification]);

  return (
    <ToDosDetailControllerContext.Provider
      value={{
        closePage,
        document: { ...document, _id: id },
        loading,
        schema: toDosApi.getSchema(),
        onSubmit,
        changeToEdit
      }}
    >
      <ToDosDetailView />
    </ToDosDetailControllerContext.Provider>
  );
};

export default ToDosDetailController;
