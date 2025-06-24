import { IDoc } from '/imports/typings/IDoc';
import { ISchema } from '/imports/typings/ISchema';

export interface IToDos extends IDoc {
  descricao: string;
  concluido?: boolean;
  isPersonal?: boolean;
  createdby?: string;
  createdat?: Date;
  nomeUsuario?: string;
  
}

export const toDosSch: ISchema<IToDos> = {
  descricao: {
    type: String,
    label: 'Descrição da tarefa',
    defaultValue: '',
    optional: false
  },
  concluido: {
    type: Boolean,
    label: 'Tarefa concluída?',
    optional: true,
    defaultValue: false
  },
  isPersonal: {
    type: Boolean,
    label: 'Tarefa pessoal?',
    optional: true,
    defaultValue: false
  },
  createdby: {
    type: String,
    label: 'Criado por',
    optional: true
  },
  createdat: {
    type: Date,
    label: 'Criado em',
    optional: true
  }
};
