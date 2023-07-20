const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// import router from './route'

const app = express();
app.use(express.json());
app.use(cors());
const port = 3333;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'BouNO4+37jb',
    database: 'clientes',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Conexão estabelecida com sucesso')
    }
});

app.get('/', (request, response) => {
    connection.query( `select * from info`,(err, results) => {
        if(err) {
            console.log('Erro', err)
            response.status(500).send('Não foi possível completar a requisição.');
        } 
         response.json(results);
    });
});

app.post('/', (request, response) => {
    
    const { name, mail, phone, address, cpf } = request.body;

    const query =
        `insert into info (nome, email, telefone, endereco, cpf)
        VALUES(?, ?, ?, ?, ?)`;

        connection.query( query, [name, mail, phone, address, cpf], (err, results) => {
            if(err) {
                console.log('Erro', err)
                response.status(500).send('Não foi possível completar a requisição.');
            } 
             response.status(201).send('Registro inserido com sucesso');
        });
    });

    app.delete('/:id', (request, response) => {
        const id = request.params.id;
        const query =
        `delete from info where id = ?`;

        connection.query(query, [id], (err, results) => {
            if(err) {
                console.log('Erro', err)
                response.status(500).send('Erro ao excluir.');
            } else if (results.affectedRows === 0) {
                response.status(404).send('Registro não encontrado.')
            } 
            else {
            response.status(200).send('Excluído com sucesso.')
        }
        })
    })

    app.put('/:id', (request, response) => {
        const id = request.params.id;
        const { name, mail, phone, address, cpf } = request.body;
        const query =
        `update info
        set nome = ?, email = ?, endereco = ?, cpf = ?, telefone = ?
        where id = ${id}`;
    
        connection.query(query, [name, mail, address, cpf, phone], (err, results) => {
            if(err) {
                console.log('Erro', err)
                response.status(500).send('Erro ao editar.');
            } else if (results.affectedRows === 0) {
                response.status(404).send('Registro não encontrado.')
            } 
            else {
            response.status(200).send('Editado com sucesso.')
        }
        })
    })

app.listen(port, ( ) => {
    console.log('Iniciado com sucesso.')
});
