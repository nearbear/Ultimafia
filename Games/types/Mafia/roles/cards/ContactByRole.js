const Card = require("../../Card");

module.exports = class ContactByRole extends Card {
  constructor(role) {
    super(role);
    this.listeners = {
      state: function (stateInfo) {
        let ability = {
          name: "Contact",
          targetsDescription: { include: ["all"], exclude: ["self"] },
          targetType: "role",
          verb: "",
        };

        if (this.player.role.name == "Agent") {
          ability = {
            name: "Contact",
            targetsDescription: { include: ["all"], exclude: ["Village"] },
            targetType: "role",
            verb: "",
          };
        }

        for (let item of this.player.items) {
          if (item.name == "OverturnSpectator") {
            item.meetings["Overturn Vote"].speechAbilities = [ability];
          }
          if (item.name == "Room" && this.game.RoomOne.includes(this.player)) {
            item.meetings["Room 1"].speechAbilities = [ability];
          }
          if (item.name == "Room" && this.game.RoomTwo.includes(this.player)) {
            item.meetings["Room 2"].speechAbilities = [ability];
          }
        }
      },
    };
  }

  speak(message) {
    if (message.abilityName != "Contact") return;

    message.modified = true;
    message.anonymous = true;
    message.quotable = false;
    message.prefix = `says to the ${message.abilityTarget}`;
    message.recipients = [message.sender];
    message.parseForReview = this.parseForReview;

    for (let player of message.game.players)
      if (player.role.name == message.abilityTarget)
        message.recipients.push(player);

    if (message.recipients.length == 1) {
      message.cancel = true;
      return;
    }
  }

  parseForReview(message) {
    message.recipients = message.versions["*"].recipients;
    message.prefix = message.versions["*"].prefix;
    return message;
  }
};
