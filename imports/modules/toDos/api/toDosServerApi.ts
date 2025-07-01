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
      'toDosRecent',
      () => {
        const userId = Meteor.userId();

        const filter: any = {
          $or: [
            { tipo: 'Pública' },
            ...(userId ? [{ createdby: userId }] : [])
          ]
        };
        
        return this.defaultListCollectionPublication(filter, {
          projection: {
            nome: 1,
            descricao: 1,
            concluido: 1,
            createdat: 1,
            createdby: 1,
            tipo: 1,
            nomeUsuario: 1
          },
          sort: { createdat: -1 },
          limit: 5,
        });
      },
      async (doc: IToDos & { nomeUsuario?: string }) => {
        const userProfile = await userprofileServerApi
          .getCollectionInstance()
          .findOneAsync({ _id: doc.createdby });

        return {
          ...doc,
          nomeUsuario: userProfile?.username || 'Desconhecido'
        };
      }
    );

    this.addTransformedPublication(
      'toDosList',
      (filter: { descricao?: string; usuarioId?: string; skip?: number; limit?: number } = {}) => {
        const userId = Meteor.userId();

        // Começa com as tarefas públicas OU do próprio usuário logado
        let baseFilter: any = {
          $or: [
            { tipo: 'Pública' },
            ...(userId ? [{ createdby: userId }] : [])
          ]
        };

        if (filter.usuarioId) {
          baseFilter = {
            $and: [
              baseFilter,
              { createdby: filter.usuarioId }
            ]
          };
        }

        if (filter.descricao) {
          const searchRegex = { $regex: filter.descricao, $options: 'i' };
          baseFilter = {
            $and: [
              baseFilter,
              { $or: [{ descricao: searchRegex }, { nome: searchRegex }] }
            ]
          };
        }

        return this.defaultListCollectionPublication(baseFilter, {
          projection: {
            nome: 1,
            descricao: 1,
            concluido: 1,
            createdat: 1,
            createdby: 1,
            tipo: 1
          },
          skip: filter.skip ?? 0,
          limit: filter.limit,
          sort: { createdat: -1 }
        });
      },
      async (doc: IToDos & { nomeUsuario?: string }) => {
        const userProfile = await userprofileServerApi
          .getCollectionInstance()
          .findOneAsync({ _id: doc.createdby });

        return {
          ...doc,
          nomeUsuario: userProfile?.username || 'Desconhecido'
        };
      }
    );


    this.addPublication('toDosDetail', (filter = {}, context: IContext) => {
      const userId = context?.user?._id;

      const finalFilter = {
        $or: [
          { tipo: 'Pública' },
          ...(userId ? [{ createdby: userId }] : [])
        ],
        ...filter
      };

      return this.defaultDetailCollectionPublication(finalFilter as Partial<IToDos>, {
        projection: {
          nome: 1,
          descricao: 1,
          concluido: 1,
          createdby: 1,
          createdat: 1,
          tipo: 1
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
          const cursor = await self.defaultCollectionPublication({ _id: params.toDosId }, {});
          const result = await cursor.fetchAsync();
          return result;
        }

        return { ...params };
      },
      ['get']
    );
  }

  
  async serverInsert(doc: IToDos, context: IContext) {
    doc.createdby = context.user._id;
    const _id = await super.serverInsert(doc, context);
    return {
      status: 'success',
      message: 'Tarefa criada com sucesso! (Mensagem do Backend)',
      _id
    };
  }


  async serverUpdate(doc: IToDos, context: IContext) {
    const task = await this.collectionInstance.findOneAsync({ _id: doc._id });

    const isOwner = task?.createdby === context.user._id;
    const isAdmin = context.user.roles?.includes('Administrador') ?? false;

    if (!isOwner && !isAdmin) {
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

    const isOwner = task?.createdby === context.user._id;
    const isAdmin = context.user.roles?.includes('Administrador') ?? false;

    if (!isOwner && !isAdmin) {
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