import { IDoc } from '/imports/typings/IDoc';
import { ISchema } from '/imports/typings/ISchema';

export interface IToDos extends IDoc {
  nome: string;
  descricao?: string;
  concluido?: boolean;
  tipo: 'Pública' | 'Pessoal';
  createdby?: string;
  createdat?: Date;
  nomeUsuario?: string;
}

export const toDosSch: ISchema<IToDos> = {
  nome: {
    type: String,
    label: 'Nome da tarefa',
    optional: false
  },
  descricao: {
    type: String,
    label: 'Descrição da tarefa',
    optional: true
  },
  concluido: {
    type: Boolean,
    label: 'Tarefa concluída?',
    optional: true,
    defaultValue: false
  },

  tipo: {
    type: String,
    label: 'Tipo',
    optional: false,
    defaultValue: 'Pública',
    validationFunction: (value) => {
      if (!['Pública', 'Pessoal'].includes(value)) {
        return 'O valor para o tipo da tarefa é inválido.';
      }
    }
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
