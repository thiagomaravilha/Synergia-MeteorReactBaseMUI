import React, { useContext, useEffect, useRef, useState } from 'react';
import SignInStyles from './signInStyles';
import { useNavigate } from 'react-router-dom';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { signInSchema } from './signinsch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import { ISysFormMethods } from '../../../ui/components/sysForm/sysForm';

const SignInPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user, signIn } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const { Container, Content, FormContainer, FormWrapper } = SignInStyles;

	const formRef = useRef<ISysFormMethods>(null);
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);

	const handleSubmit = ({ email, password }: { email: string; password: string }) => {
		signIn(email, password, (err) => {
			if (!err) {
				navigate('/');
				return;
			}
			showNotification({
				type: 'error',
				title: 'Erro ao tentar logar',
				message: 'Email ou senha inválidos',
			});
		});
	};

	const handleForgotPassword = () => navigate('/password-recovery');

	const checkButtonState = () => {
		const doc = formRef.current?.getDocValues();
		const isFilled = !!doc?.email?.trim() && !!doc?.password?.trim();
		setIsButtonDisabled(!isFilled);
	};

	useEffect(() => {
		if (user) navigate('/');
	}, [user]);

	useEffect(() => {
		setTimeout(() => {
			checkButtonState();
		}, 0);
	}, []);

	return (
		<Container>
			<Content>
				<Typography
					variant="h1"
					fontWeight="bold"
					sx={{
						color: (theme) => theme.palette.primary.main,
						letterSpacing: 1,
					}}
				>
					ToDo List
				</Typography>


				<Typography variant="body1" color={(theme) => theme.palette.sysText?.body}>
					Boas-vindas à sua lista de tarefas. <br />
					Insira seu e-mail e senha para efetuar o login:
				</Typography>

				<FormContainer>
					<SysForm
						ref={formRef}
						schema={signInSchema}
						onSubmit={handleSubmit}
						onChange={checkButtonState}
						debugAlerts={false}
					>
						<FormWrapper>
							<SysTextField
								name="email"
								label="E-mail"
								fullWidth
								placeholder="Digite seu e-mail"
							/>
							<SysTextField
								name="password"
								label="Senha"
								fullWidth
								placeholder="Digite sua senha"
								type="password"
							/>

							<SysFormButton
								variant="contained"
								fullWidth
								disabled={isButtonDisabled}
								sx={(theme) => ({
									backgroundColor: isButtonDisabled
										? theme.palette.sysAction?.bgDisabled
										: theme.palette.primary.main,
									color: theme.palette.primary.contrastText,
									fontWeight: 'bold',
									textTransform: 'none',
									borderRadius: 2,
									'&:hover': {
										backgroundColor: isButtonDisabled
											? theme.palette.sysAction?.bgDisabled
											: theme.palette.primary.dark,
									},
								})}
							>
								Entrar
							</SysFormButton>
						</FormWrapper>
					</SysForm>
				</FormContainer>

				<Box mt={2}>
					<Typography fontSize={14}>
						Esqueceu sua senha?{' '}
						<Typography
							component="span"
							variant="link"
							sx={(theme) => ({
								cursor: 'pointer',
								textDecoration: 'underline',
								color: theme.palette.primary.main,
							})}
							onClick={handleForgotPassword}
						>
							Clique aqui
						</Typography>
					</Typography>
				</Box>

				<Box mt={1}>
					<Typography fontSize={14}>
						Novo por aqui?{' '}
						<Typography
							component="span"
							variant="link"
							sx={(theme) => ({
								cursor: 'pointer',
								textDecoration: 'underline',
								color: theme.palette.primary.main,
							})}
							onClick={() => navigate('/sign-up')}
						>
							Cadastre-se
						</Typography>
					</Typography>
				</Box>
			</Content>
		</Container>
	);
};

export default SignInPage;
