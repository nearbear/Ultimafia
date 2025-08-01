const Card = require("../../Card");
const { MEETING_PRIORITY_SEANCE } = require("../../const/MeetingPriority");
const { PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class SeanceTarget extends Card {
  constructor(role) {
    super(role);

    this.listeners = {
      roleAssigned: function (player) {
        if (player !== this.player) {
          return;
        }

        this.data.meetingName = "Seance with " + this.player.name;
        this.meetings[this.data.meetingName] =
          this.meetings["SeancePlaceholder"];
        delete this.meetings["SeancePlaceholder"];
      },
    };

    this.meetings = {
      "Seance Player": {
        states: ["Day"],
        flags: ["voting"],
        targets: { include: ["dead"], exclude: ["alive", "self"] },
        action: {
          labels: ["seance"],
          priority: PRIORITY_DAY_DEFAULT,
          role: this.role,
          run: function () {
            if (!this.actor.hasAbility(["Meeting"])) {
              return;
            }
            if (this.dominates()) {
              this.target.holdItem("Summon", this.role.data.meetingName);
            }
          },
        },
      },
      SeancePlaceholder: {
        meetingName: "Seance",
        actionName: "End Seance Meeting?",
        states: ["Night"],
        flags: [
          "exclusive",
          "group",
          "speech",
          "anonymous",
          "voting",
          "mustAct",
          "noVeg",
        ],
        inputType: "boolean",
        speakDead: true,
        priority: MEETING_PRIORITY_SEANCE,
        shouldMeet: function () {
          for (let player of this.game.players)
            if (
              player.hasItemProp("Summon", "meetingName", this.data.meetingName)
            ) {
              return true;
            }

          return false;
        },
      },
    };
  }
};
