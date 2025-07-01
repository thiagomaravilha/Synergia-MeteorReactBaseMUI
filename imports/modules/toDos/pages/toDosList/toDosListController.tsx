import React, { useCallback, useMemo, useState, useContext } from 'react';
import ToDosListView from './toDosListView';
import { nanoid } from 'nanoid';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { IToDos } from '../../api/toDosSch';
import { toDosApi } from '../../api/toDosApi';
import { IMeteorError } from '/imports/typings/IMeteorError';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

type ScreenState = 'view' | 'edit' | 'create';

const INITIAL_VISIBLE_COUNT = 4;

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
  naoConcluidas: IToDos[];
  concluidas: IToDos[];
  loading: boolean;
  searchInput: string;
  hasSearched: boolean;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  onShowMoreNaoConcluidas: () => void;
  onShowMoreConcluidas: () => void;
  onShowLessNaoConcluidas: () => void;
  onShowLessConcluidas: () => void;
  canShowMoreNaoConcluidas: boolean;
  canShowMoreConcluidas: boolean;
  showAllNaoConcluidas: boolean;
  showAllConcluidas: boolean;
  totalNaoConcluidas: number;
  totalConcluidas: number;
  mostrarSomenteMinhasTarefas: boolean;
  alternarMinhasTarefas: () => void;
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
  const [mostrarSomenteMinhasTarefas, setMostrarSomenteMinhasTarefas] = useState(false);

  const [showAllNaoConcluidas, setShowAllNaoConcluidas] = useState(false);
  const [showAllConcluidas, setShowAllConcluidas] = useState(false);

  const sysLayoutContext = useContext(AppLayoutContext);
  const usuarioId = Meteor.userId();

  const { loading, naoConcluidas, concluidas } = useTracker(() => {
    const baseFilter: any = {};

    if (searchText) {
      baseFilter.descricao = searchText;
    }

    if (mostrarSomenteMinhasTarefas && usuarioId) {
      baseFilter.usuarioId = usuarioId;
    }

    const subHandle = toDosApi.subscribe('toDosList', baseFilter);
    const isLoading = !(subHandle && subHandle.ready());
    const allToDos = toDosApi.find({}).fetch();

    const naoConcluidasItems = allToDos.filter(t => !t.concluido);
    const concluidasItems = allToDos.filter(t => t.concluido);

    return {
      naoConcluidas: naoConcluidasItems,
      concluidas: concluidasItems,
      loading: isLoading,
    };
  }, [searchText, mostrarSomenteMinhasTarefas, usuarioId]);

  const onSearch = useCallback(() => {
    setShowAllNaoConcluidas(false);
    setShowAllConcluidas(false);
    setSearchText(searchInput.trim());
    setHasSearched(!!searchInput.trim());
  }, [searchInput]);

  const onClearSearch = useCallback(() => {
    setSearchText('');
    setSearchInput('');
    setHasSearched(false);
    setShowAllNaoConcluidas(false);
    setShowAllConcluidas(false);
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
        sysLayoutContext.showNotification?.({ type: 'success', title: 'Tarefa removida', message: res?.message ?? 'Tarefa excluída com sucesso!' });
      } else {
        sysLayoutContext.showNotification?.({ type: 'error', title: 'Erro ao excluir', message: e.reason || 'Erro desconhecido ao remover tarefa' });
      }
    });
  }, [sysLayoutContext]);

  const onToggleCheck = useCallback((row: IToDos) => {
    toDosApi.update({ ...row, concluido: !row.concluido });
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

  const alternarMinhasTarefas = useCallback(() => {
    setMostrarSomenteMinhasTarefas(prev => !prev);
  }, []);

  const onShowMoreNaoConcluidas = useCallback(() => setShowAllNaoConcluidas(true), []);
  const onShowMoreConcluidas = useCallback(() => setShowAllConcluidas(true), []);
  const onShowLessNaoConcluidas = useCallback(() => setShowAllNaoConcluidas(false), []);
  const onShowLessConcluidas = useCallback(() => setShowAllConcluidas(false), []);

  const visibleNaoConcluidas = useMemo(() =>
    showAllNaoConcluidas ? naoConcluidas : naoConcluidas.slice(0, INITIAL_VISIBLE_COUNT),
    [naoConcluidas, showAllNaoConcluidas]
  );

  const visibleConcluidas = useMemo(() =>
    showAllConcluidas ? concluidas : concluidas.slice(0, INITIAL_VISIBLE_COUNT),
    [concluidas, showAllConcluidas]
  );

  const canShowMoreNaoConcluidas = !showAllNaoConcluidas && naoConcluidas.length > INITIAL_VISIBLE_COUNT;
  const canShowMoreConcluidas = !showAllConcluidas && concluidas.length > INITIAL_VISIBLE_COUNT;

  const providerValues = useMemo(() => ({
    onAddButtonClick,
    onDeleteButtonClick,
    onToggleCheck,
    onItemClick,
    onEditButtonClick,
    onCloseModal,
    selectedTaskId,
    modalState,
    isModalOpen,
    naoConcluidas: visibleNaoConcluidas,
    concluidas: visibleConcluidas,
    loading,
    searchInput,
    hasSearched,
    setSearchInput,
    onSearch,
    onClearSearch,
    onShowMoreNaoConcluidas,
    onShowMoreConcluidas,
    onShowLessNaoConcluidas,
    onShowLessConcluidas,
    canShowMoreNaoConcluidas,
    canShowMoreConcluidas,
    showAllNaoConcluidas,
    showAllConcluidas,
    totalNaoConcluidas: naoConcluidas.length,
    totalConcluidas: concluidas.length,
    mostrarSomenteMinhasTarefas,
    alternarMinhasTarefas
  }), [
    visibleNaoConcluidas,
    visibleConcluidas,
    loading,
    selectedTaskId,
    isModalOpen,
    modalState,
    searchInput,
    hasSearched,
    naoConcluidas.length,
    concluidas.length,
    canShowMoreNaoConcluidas,
    canShowMoreConcluidas,
    showAllNaoConcluidas,
    showAllConcluidas,
    mostrarSomenteMinhasTarefas
  ]);

  return (
    <ToDosListControllerContext.Provider value={providerValues}>
      <ToDosListView />
    </ToDosListControllerContext.Provider>
  );
};

export default ToDosListController;
