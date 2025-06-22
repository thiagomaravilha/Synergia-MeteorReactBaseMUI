// region Imports
import { Recurso } from '../config/recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { Meteor } from 'meteor/meteor';
import { IContext } from '/imports/typings/IContext';
// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
  constructor() {
    super('toDos', toDosSch, {
      resources: Recurso
    });

    const self = this;

    this.addTransformedPublication(
      'toDosList',
      (filter = {}) => {
        return this.defaultListCollectionPublication(filter, {
          projection: {
            descricao: 1,
            concluido: 1,
            createdat: 1,
            createdby: 1
          }
        });
      },
      async (doc: IToDos & { nomeUsuario?: string }) => {
        const userProfileDoc = await userprofileServerApi
          .getCollectionInstance()
          .findOneAsync({ _id: doc.createdby });

        return {
          ...doc,
          nomeUsuario: userProfileDoc?.username || 'Desconhecido'
        };
      }
    );

    this.addPublication('toDosDetail', (filter = {}) => {
      return this.defaultDetailCollectionPublication(filter, {
        projection: {
          descricao: 1,
          concluido: 1,
          createdby: 1,
          createdat: 1
        }
      });
    });

    this.addRestEndpoint(
      'view',
      (params, options) => {
        console.log('Params', params);
        console.log('options.headers', options.headers);
        return { status: 'ok' };
      },
      ['post']
    );

    this.addRestEndpoint(
      'view/:toDosId',
      async (params, _options) => {
        if (params.toDosId) {
          const cursor = await self
            .defaultCollectionPublication({ _id: params.toDosId }, {});
          const result = await cursor.fetchAsync();
          return result;
        } else {
          return { ...params };
        }
      },
      ['get']
    );
  }

  async serverInsert(doc: IToDos, context: IContext) {
    const _id = await super.serverInsert(doc, context);
    return {
      status: 'success',
      message: 'Tarefa criada com sucesso! (Mensagem do Backend)',
      _id
    };
  }

  async serverUpdate(doc: IToDos, context: IContext) {
    const task = await this.collectionInstance.findOneAsync({ _id: doc._id });

    // LÓGICA DE PERMISSÃO CORRIGIDA
    if (task?.createdby !== context.user._id && context.user.roles?.indexOf('Administrador') === -1) {
      throw new Meteor.Error('not-authorized', 'Você não tem permissão para editar esta tarefa.');
    }

    await super.serverUpdate(doc, context);
    return {
      status: 'success',
      message: 'Tarefa atualizada com sucesso! (Mensagem do Backend)'
    };
  }

  async serverRemove(doc: IToDos, context: IContext) {
    const task = await this.collectionInstance.findOneAsync({ _id: doc._id });

    if (task?.createdby !== context.user._id && context.user.roles?.indexOf('Administrador') === -1) {
      throw new Meteor.Error('not-authorized', 'Você não tem permissão para excluir esta tarefa.');
    }

    await super.serverRemove(doc, context);
    return {
      status: 'success',
      message: 'Tarefa removida com sucesso! (Mensagem do Backend)'
    };
  }
}

export const toDosServerApi = new ToDosServerApi();