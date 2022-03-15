/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('anderson30.qa@gmail.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });


     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(18)
          })

     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let usuario = `Cadastro novo  ${Math.floor(Math.random() * 100000000)}`
          let email = `usuarioqa.${Math.floor(Math.random() * 100000000)}@teste.com`
          cy.cadastrarUsuario(usuario, email, "senhateste", "true")
               .then((response) => {
                    expect(response.status).to.equal(201)
                    expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               })
     });




     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario("Miranda", "mirandaqa@gmail.com", "testi", "false")
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.message).to.equal('Este email já está sendo usado')
               })



     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let usuario = `Cadastro novo  ${Math.floor(Math.random() * 100000000)}`
          let email = `usuarioqa.${Math.floor(Math.random() * 100000000)}@teste.com`
          cy.cadastrarUsuario(usuario, email, "teste", "true")
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body: {
                              "nome": usuario,
                              "email": email,
                              "password": "usuarioeditado",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               });
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let usuario = `Cadastro novo  ${Math.floor(Math.random() * 100000000)}`
          let email = `usuarioqa.${Math.floor(Math.random() * 100000000)}@teste.com`
          cy.cadastrarUsuario(usuario, email, "teste", "true")
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)

                    })

               })
     });


});
