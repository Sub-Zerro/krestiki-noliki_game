const express = require('express');
const { readFile } = require('fs');
const { redirect } = require('statuses');
       app = express()
       fs = require('fs');
       path = require('path');
       Game = require('./models/game.js');
       session = require('express-session');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;




app.use(
    session({
        secret: 'you secret key'
    })
);


//app.use(express.static(path.join(__dirname + '/css')));
app.use(express.json());
app.use(express.urlencoded());
//Для чтения файловпри get запросах ниже


app.get('/', function(req, res) {
    if (req.session.user){
        res.sendFile(__dirname + "/index.html");
    }else{
        res.redirect('/login');
    }
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + "/login.html");
})

app.get('/reset', async function(req, res) {
    let game = await new Game();
    await game.reset();
})

app.get('/out', async function(req, res) {
    req.session.destroy();
    console.log('done');
    res.redirect('/');
})

app.post('/login', (req, res)=>{

    console.log(req.body.login);

    let arr = [
        {
            login: '0',
            id: '0'
        },
        {
            login: '1',
            id: '1'
        }   
    ]

    

    arr.find(e=>{
        console.log(typeof(e.login), typeof(req.body.login));
        if (e.login == req.body.login){
            console.log('сука');
            req.session.user = e.id;
        }
    });

    res.redirect('/');
})



app.post('/update', async(req, res)=>{
    let game = new Game();
    let data_to_send = req.body.id;

    try {
        //все норм с моделью
        let game_situation = await game.to_json();
        console.log(game_situation);


        if (req.body.role == game_situation["motion"]){
            game_situation["game"][req.body.id] = req.body.role;
            game_situation["motion"] = Math.abs(+(Math.abs(game_situation["motion"])-1))
        }
        
        //записываю ход игрока

        await game.write_game(game_situation);
        res.send({is_ok: true});

    } catch (error) {
        //ошибка
        res.send({is_ok: false});
        console.log(error);
    }
})

app.post('/online', async(req, res)=>{
    let game = await new Game();
    let data = await game.to_json();
    res.send({game: data, session: req.session.user})
})

app.post('/new_game', async(req, res)=>{
    req.session = null; 
    
    let game = await new Game();
    console.log('roma', req.body.win);
    await game.new_game(req.body.win);

    res.redirect('/');
})

// app.post('/')


app.use(express.static(path.join(__dirname)));




// setInterval(()=>{
//     console.log(player1.abuse);
// }, 1000)



const PORT = process.env.PORT;
app.listen(PORT || 3000);
//Пролушиваемый порт