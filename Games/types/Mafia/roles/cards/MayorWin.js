const Card = require("../../Card");
const Action = require("../../Action");
const { PRIORITY_DAY_EFFECT_DEFAULT, PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class MayorWin extends Card {
  constructor(role) {
    super(role);


    this.winCheckSpecial = {
      priority: PRIORITY_WIN_CHECK_DEFAULT,
      againOnFinished: true,
      check: function (counts, winners, aliveCount, confirmedFinished) {
        if(!this.player.hasAbility(["Win-Con", "OnlyWhenAlive"])){
          return;
        }
            
              
        if (this.data.MayorWin && this.player.hasAbility(["Win-Con", "OnlyWhenAlive"]) && aliveCount == 3) {
          for(let player of this.game.players){
            if(player.faction == this.player.faction){
              winners.addPlayer(player, player.faction);
            }
          }
        }
      },
    };

  /*  
    this.actions = [
      {
        priority: PRIORITY_DAY_EFFECT_DEFAULT + 1,
        run: function () {
          if (!this.actor.alive) return;
          if (this.game.alivePlayers().length != 3) {
            this.actor.role.data.MayorWin = false;
            return;
          }
          if (
            this.game.getStateName() == "Day" ||
            this.game.getStateName() == "Dusk"
          ) {
            let alivePlayers = this.game.players.filter((p) => p.role);

            for (let x = 0; x < alivePlayers.length; x++) {
              for (let action of this.game.actions[0]) {
                if (
                  action.target == alivePlayers[x] &&
                  action.hasLabel("condemn")
                ) {
                  this.actor.role.data.MayorWin = false;
                  return;
                }
              }
            }
            this.actor.queueAlert(
              `Now that only 3 players are alive today, Town will win if no one is executed Today!`
            );
            
            this.actor.role.data.MayorWin = true;
            return;
          }
        },
      },
    ];
*/
    this.listeners = {
        state: function (stateInfo) {
        if (!stateInfo.name.match(/Day/)) {
          return;
        }

        var action = new Action({
          actor: this.player,
          game: this.player.game,
          role: this.role,
          priority: PRIORITY_DAY_EFFECT_DEFAULT + 1,
          labels: ["hidden", "absolute"],
          run: function () {
          if (!this.actor.hasAbility(["Win-Con", "OnlyWhenAlive"])) return;
          if (this.game.alivePlayers().length != 3) {
            this.role.data.MayorWin = false;
            return;
          }
            let alivePlayers = this.game.players.filter((p) => p.role);

            for (let x = 0; x < alivePlayers.length; x++) {
              for (let action of this.game.actions[0]) {
                if (
                  action.target == alivePlayers[x] &&
                  action.hasLabel("condemn")
                ) {
                  this.role.data.MayorWin = false;
                  return;
                }
              }
            }
            /*
            this.actor.queueAlert(
              `Now that only 3 players are alive today, Town will win if no one is executed Today!`
            );
            */
            this.role.data.MayorWin = true;
            return;
        },
        });

        this.game.queueAction(action);
      },
    };
  }
    
  };

