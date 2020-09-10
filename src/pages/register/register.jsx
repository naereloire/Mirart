import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from '../../components/Form.jsx';
import { v4 as uid } from 'uuid';
import { firebase } from '../../config/fireconfig';
import API from '../../api';

const bodyRegister = (userInfos) => {
  const bodyObj = {
    idempotencyKey: uid(),
    owner: {
      type: 'PF',
      name: userInfos['Nome'],
      companyName: 'Mirart',
      email: userInfos['E-mail'],
      homePhone: userInfos['Telefone'],
      businessPhone: '1131859600',
      mobilePhone: '1131859600',
      address: {
        street: userInfos['Endereço'] ? userInfos['Endereço'] : 'não informado',
        number: userInfos['Numero'] ? userInfos['Numero'] : 'não informado',
        district: 'Brasil',
        city: userInfos['Cidade'] ? userInfos['Cidade'] : 'não informado',
        state: userInfos['Estado'] ? userInfos['Estado'] : 'SP',
        zipcode: userInfos['CEP'] ? userInfos['CEP'] : '01001001',
      },
      identifierDocument: {
        document: userInfos['CPF'],
        type: 'CPF',
      },
      documents: [
        {
          type: 'CPF',
          document: userInfos['CPF'],
        },
      ],
    },
  };
  return bodyObj;
};

const Register = () => {
  let history = useHistory();
  const [dadosUser, setDadosUser] = useState({}),
    [error, setError] = useState('');

  const btnBack = (event) => {
    event.preventDefault();
    history.push('/');
  };

  const handleRegister = (event) => {
    event.preventDefault();
    console.log(JSON.stringify(bodyRegister(dadosUser)));
    API.post('accounts/child', bodyRegister(dadosUser))
      .then((response) => {
        console.log('Key Acount ' + response.data.financialOperationKey);
        firebase
          .auth()
          .createUserWithEmailAndPassword(
            dadosUser['E-mail'],
            dadosUser['Senha'],
          )
          .then((result) => {
            result.user
              .updateProfile({
                photoURL: response.data.financialOperationKey,
              })
              .then(() => {
                history.push('/home');
              });
          })
          .catch((error) => {
            setError(error.message);
          });
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form>
      <h2>CADASTRO</h2>

      <Form
        options={[
          'Nome',
          'E-mail',
          'Senha',
          'CPF',
          'Telefone',
          'Endereço',
          'Numero',
          'Cidade',
          'Estado',
          'CEP',
        ]}
        value={dadosUser}
        setValue={setDadosUser}
      />
      <button type="submit" onClick={handleRegister}>
        ENVIAR
      </button>
      <button type="" onClick={btnBack}>
        VOLTAR
      </button>
      <p>{error}</p>
    </form>
  );
};

export default Register;