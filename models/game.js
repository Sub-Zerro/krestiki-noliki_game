const path = require('path');
const fs = require('fs');
const database = require('mime-db');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'database.json'
  )

class Game{
    static async get_game(){
        return new Promise((resolve, rejects)=>{
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) {
                  reject(err)
                } else {
                  resolve(JSON.parse(content))
                }
              })
        })
    }

    to_json(){
        return Game.get_game();
    }

    async write_game(data){
        fs.writeFile(p, JSON.stringify(data), (err) => {
            if (err)
              console.log(err);
            else {
              console.log("Записалось");
            }
          });
    }

    async new_game(win){
      let data  = await Game.get_game();

      data["game"] = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
      data["motion"] = 0;

      console.log(typeof(Number(win)), Number(win));

      data["winners"][Number(win)]++;
      //console.log(data);

      fs.writeFile(p, JSON.stringify(data), (err) => {
          if (err)
            console.log(err);
          else {
            console.log("Новая игра");
          }
        });
    }

    async reset(){
      let data  = {"game":[-1,-1,-1,-1,-1,-1,-1,-1,-1],"motion":0,"winners":[0,0]}

      fs.writeFile(p, JSON.stringify(data), (err) => {
          if (err)
            console.log(err);
          else {
            console.log("Новая игра");
          }
        });
    }

    async draw(){
      let temp_game = await this.to_json();
      console.log('TEMP', temp_game);

      temp_game["game"] = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
      temp_game["motion"] = 0;


      fs.writeFile(p, JSON.stringify(temp_game), (err) => {
          if (err)
            console.log(err);
          else {
            console.log("Была ничья");
          }
        });
    }
}

module.exports = Game;