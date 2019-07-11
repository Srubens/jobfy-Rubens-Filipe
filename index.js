// IMPORTOU O EXPRESS E CHAMOU COMO UMA FUNÇÃO
const express = require('express');
const app = express();

//ADD SQLITE
const sqlite = require('sqlite');
const dbConnection = sqlite.open('banco.sqlite', { Promise });

app.set('view engine', 'ejs');
//CASO O EXPRESS NÃO ACHE NADA PARA QUE VA PARA A PASTA PUBLIC
app.use(express.static('public'));

// ROTAS DE NAVEGAÇÃO
app.get('/', async(request, response) => {
	const db = await dbConnection;
	const categoriasDb = await db.all('select * from categorias');	
	const vagas = await db.all('select * from vagas');	
	const categorias = categoriasDb.map( cat =>{
		return {
			...cat,
			vagas: vagas.filter( vaga => vaga.categoria === cat.id )
		}
	})
	// console.log(categorias);
	response.render('home', { categorias });
});

app.get('/vaga/:id', async(request, response)=>{
	console.log(request.params);
	const db = await dbConnection;
	const vaga = await db.get('select * from vagas where id ='+ request.params.id );
	// console.log(vaga);
	response.render('vaga', {vaga});
});

app.get('/admin', (req, res) =>{
	res.render('admin/home')
})

const init = async() =>{
	const db = await dbConnection;
	await db.run('create table if not exists categorias(id INTEGER PRIMARY KEY, categoria TEXT)');
	await db.run('create table if not exists vagas(id INTEGER PRIMARY KEY, categoria INTEGER, titulo TEXT, descricao TEXT)')
	// const categoria = 'Social Media';
	// await db.run(`insert into 	categorias(categoria) values('${categoria}') `);
	// const vaga = 'Social Media';
	// const descricao = 'Vaga para Social Media para alunos da FullStack Lab'
	// await db.run(`insert into 	vagas(categoria, titulo, descricao) values(3,'${vaga}','${descricao}') `);
}

init();

//ABRINDO A PORTA PARA ESCUTAR O RESPONSE
app.listen(3000, (err)=>{
	if(err){
		console.log('Não foi possível encontrar o servidor do JobFy');
	}else{
		console.log('JobFy rodando...');
	}
});