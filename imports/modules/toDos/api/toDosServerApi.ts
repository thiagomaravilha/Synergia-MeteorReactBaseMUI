// region Imports
import { Recurso } from '../config/recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '/imports/modules/userprofile/api/userProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
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

  override async insert(doc: IToDos, userId: string) {
    const _id = super.insert(doc, userId);
    return {
      status: 'success',
      message: 'Tarefa criada com sucesso!',
      _id
    };
  }

  override async update(doc: IToDos, userId: string) {
    const task = await this.collectionInstance.findOneAsync({ _id: doc._id });

    if (task?.createdby !== userId) {
      throw new Meteor.Error('not-authorized', 'Você não tem permissão para editar esta tarefa.');
    }

    super.update(doc, userId);
    return {
      status: 'success',
      message: 'Tarefa atualizada com sucesso!'
    };
  }

  override async remove(doc: IToDos, userId: string) {
    const task = await this.collectionInstance.findOneAsync({ _id: doc._id });

    if (task?.createdby !== userId) {
      throw new Meteor.Error('not-authorized', 'Você não tem permissão para excluir esta tarefa.');
    }

    super.remove(doc, userId);
    return {
      status: 'success',
      message: 'Tarefa removida com sucesso!'
    };
  }
}

export const toDosServerApi = new ToDosServerApi();
