import React from 'react';
import { IDefaultContainerProps } from '/imports/typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import ToDosListController from './pages/toDosList/toDosListController';
import ToDosDetailController from './pages/toDosDetail/toDosDetailController';

export interface IToDosModuleContext {
  state?: string;
  id?: string;
}

export const ToDosModuleContext = React.createContext<IToDosModuleContext>({});

export default (props: IDefaultContainerProps) => {
  const { screenState, toDosId } = useParams();
  const state = screenState ?? props.screenState;
  const id = toDosId ?? props.id;

  const validState = ['view', 'edit', 'create'];

  const renderPage = () => {
    if (!state || !validState.includes(state)) {
      return <ToDosListController />;
    }

    return <ToDosDetailController />;
  };

  return (
    <ToDosModuleContext.Provider value={{ state, id }}>
      {renderPage()}
    </ToDosModuleContext.Provider>
  );
};
