import React, { useCallback, useMemo, useState, useContext } from 'react';
import ToDosListView from './toDosListView';
import { nanoid } from 'nanoid';
import { useTracker } from 'meteor/react-meteor-data';
import { IToDos } from '../../api/toDosSch';
import { toDosApi } from '../../api/toDosApi';
import { IMeteorError } from '/imports/typings/IMeteorError';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

type ScreenState = 'view' | 'edit' | 'create';

interface IToDosListControllerContext {

  onAddButtonClick: () => void;
  onDeleteButtonClick: (row: IToDos) => void;
  onToggleCheck: (row: IToDos) => void;
  onItemClick: (id: string) => void;
  onEditButtonClick: (id: string) => void;
  onCloseModal: () => void;
  selectedTaskId: string | null;
  modalState: ScreenState;
  isModalOpen: boolean;
  todoList: IToDos[];
  loading: boolean;
  searchInput: string;
  hasSearched: boolean;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  
}

export const ToDosListControllerContext = React.createContext<IToDosListControllerContext>(
  {} as IToDosListControllerContext
);

const ToDosListController = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<ScreenState>('view');
  const [searchInput, setSearchInput] = useState('');
  const [searchText, setSearchText] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const sysLayoutContext = useContext(AppLayoutContext);



  const { loading, toDoss } = useTracker(() => {
    const filter = searchText ? { descricao: searchText } : {};
    const subHandle = toDosApi.subscribe('toDosList', filter);
    const toDoss = subHandle?.ready() ? toDosApi.find({}).fetch() : [];
    return {
      toDoss,
      loading: !!subHandle && !subHandle.ready()
    };
  }, [searchText]);

  const onSearch = useCallback(() => {
    setSearchText(searchInput.trim());
    setHasSearched(true);
  }, [searchInput]);


  const onClearSearch = useCallback(() => {
    setSearchText('');
    setSearchInput('');
    setHasSearched(false);
  }, []);


  const onAddButtonClick = useCallback(() => {
    const newDocumentId = nanoid();
    setSelectedTaskId(newDocumentId);
    setModalState('create');
    setIsModalOpen(true);
  }, []);

  const onDeleteButtonClick = useCallback((row: IToDos) => {
    toDosApi.remove(row, (e: IMeteorError, res?: { message?: string }) => {
      if (!e) {
        sysLayoutContext.showNotification?.({
          type: 'success',
          title: 'Tarefa removida',
          message: res?.message ?? 'Tarefa excluída com sucesso!'
        });
      } else {
        sysLayoutContext.showNotification?.({
          type: 'error',
          title: 'Erro ao excluir',
          message: e.reason || 'Erro desconhecido ao remover tarefa'
        });
      }
    });
  }, [sysLayoutContext]);

  const onToggleCheck = useCallback((row: IToDos) => {
    toDosApi.update({
      ...row,
      concluido: !row.concluido
    });
  }, []);

  const onItemClick = useCallback((id: string) => {
    setSelectedTaskId(id);
    setModalState('view');
    setIsModalOpen(true);
  }, []);

  const onEditButtonClick = useCallback((id: string) => {
    setSelectedTaskId(id);
    setModalState('edit');
    setIsModalOpen(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setSelectedTaskId(null);
    setIsModalOpen(false);
  }, []);

  const providerValues = useMemo(
    () => ({
      onAddButtonClick,
      onDeleteButtonClick,
      onToggleCheck,
      onItemClick,
      onEditButtonClick,
      onCloseModal,
      selectedTaskId,
      modalState,
      isModalOpen,
      todoList: toDoss,
      loading,
      searchInput,
      hasSearched,
      setSearchInput,
      onSearch,
      onClearSearch
    }),
    [toDoss, loading, selectedTaskId, isModalOpen, modalState, searchInput, hasSearched, onDeleteButtonClick, onSearch, onClearSearch]
  );

  return (
    <ToDosListControllerContext.Provider value={providerValues}>
      <ToDosListView />
    </ToDosListControllerContext.Provider>
  );
};

export default ToDosListController;
