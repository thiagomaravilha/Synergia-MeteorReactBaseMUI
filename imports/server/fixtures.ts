import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { userprofileServerApi } from '../modules/userprofile/api/userProfileServerApi';

async function createDefautUser() {
	// if (Meteor.isDevelopment && Meteor.users.find().count() === 0) {
	const count = await Meteor.users.find({}).countAsync();
	if ((await Meteor.users.find({}).countAsync()) === 0) {
		let createdUserId = '';
		createdUserId = await Accounts.createUserAsync({
			username: 'Administrador',
			email: 'admin@mrb.com',
			password: 'admin@mrb.com'
		});


		await Meteor.users.upsertAsync(
			{ _id: createdUserId },
			{
				$set: {
					'emails.0.verified': true,
					profile: {
						name: 'Admin',
						email: 'admin@mrb.com'
					}
				}
			}
		);

		await userprofileServerApi.getCollectionInstance().insertAsync({
			_id: createdUserId,
			username: 'Administrador',
			email: 'admin@mrb.com',
			roles: ['Administrador']
		});
	}
}

async function createTestUser() {
  const existingUser = await Meteor.users.findOneAsync({ username: 'usuario_teste' });
  if (!existingUser) {
    const userId = await Accounts.createUserAsync({
      username: 'usuario_teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

    await Meteor.users.upsertAsync(
      { _id: userId },
      {
        $set: {
          'emails.0.verified': true,
          profile: {
            name: 'Usuário Teste',
            email: 'usuario.teste@example.com'
          },
          roles: ['Usuario']
        }
      }
    );

    await userprofileServerApi.getCollectionInstance().insertAsync({
      _id: userId,
      username: 'usuario_teste',
      email: 'usuario.teste@example.com',
      roles: ['Usuario']
    });

    console.log('Usuário teste criado com sucesso:', userId);
  } else {
    console.log('Usuário teste já existe.');
  }
}


async function createTestAdminUser() {
  const existingUser = await Meteor.users.findOneAsync({ username: 'admin_teste' });
  if (!existingUser) {
    const userId = await Accounts.createUserAsync({
      username: 'admin_teste',
      email: 'admin@admin.com',
      password: '123456',
    });

    await Meteor.users.upsertAsync(
      { _id: userId },
      {
        $set: {
          'emails.0.verified': true,
          profile: {
            name: 'Admin Teste',
            email: 'admin@admin.com'
          },
          roles: ['Administrador']
        }
      }
    );

    await userprofileServerApi.getCollectionInstance().insertAsync({
      _id: userId,
      username: 'admin_teste',
      email: 'admin@admin.com',
      roles: ['Administrador']
    });

    console.log('Usuário teste criado com sucesso:', userId);
  } else {
    console.log('Usuário teste já existe.');
  }
}


async function createTestUser2() {
  const existingUser = await Meteor.users.findOneAsync({ username: 'usuario_teste2' });
  if (!existingUser) {
    const userId = await Accounts.createUserAsync({
      username: 'usuario_teste2',
      email: 'usuario2@usuario.com',
      password: '123456',
    });

    await Meteor.users.upsertAsync(
      { _id: userId },
      {
        $set: {
          'emails.0.verified': true,
          profile: {
            name: 'usuario_teste2',
            email: 'usuario2@usuario.com'
          },
          roles: ['Usuario']
        }
      }
    );

    await userprofileServerApi.getCollectionInstance().insertAsync({
      _id: userId,
      username: 'usuario_teste2',
      email: 'usuario2@usuario.com',
      roles: ['Usuario']
    });

    console.log('Usuário teste criado com sucesso:', userId);
  } else {
    console.log('Usuário teste já existe.');
  }
}


// if the database is empty on server start, create some sample data.
Meteor.startup(async () => {
	console.log('fixtures Meteor.startup');
	// Add default admin account
	await createDefautUser();
	await createTestUser();
	await createTestAdminUser();
  await createTestUser2();
});
