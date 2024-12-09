const Information = require("../Information");
const Random = require("../../../../lib/Random");
const {
  EVIL_FACTIONS,
  NOT_EVIL_FACTIONS,
  CULT_FACTIONS,
  MAFIA_FACTIONS,
  FACTION_LEARN_TEAM,
  FACTION_WIN_WITH_MAJORITY,
  FACTION_WITH_MEETING,
  FACTION_KILL,
} = require("../const/FactionList");

module.exports = class BinaryAlignmentInfo extends Information{
  constructor(creator, game, target) {
    super("Binary Alignment Info", creator, game);
    if(target == null){
      this.randomTarget = true;
      target = Random.randArrayVal(this.game.alivePlayers());
    }
    this.target = target;
    let role = this.target.getAppearance("investigate", true);
    let trueRole = this.target.getAppearance("real", true);
    let faction;
    if(role = trueRole){
       faction = this.target.faction;
    }
    else{
      faction = game.getRoleAlignment(role);
    }
      if(faction == "Village" || (faction == "Independent" && !(this.game.getRoleTags(this.target.role.name).includes("Hostile")))){
        this.mainInfo = "Innocent";
      }
      else{
        this.mainInfo = "Guilty";
      }
  }

  getInfoRaw(){
    super.getInfoRaw();
    return this.mainInfo;
  }

  getInfoFormated(){
    super.getInfoRaw();
        if(this.randomTarget == true){
      return `You Learn that your ${this.target.name} is ${this.mainInfo}`
    }
    return `You Learn that your Target is ${this.mainInfo}`
  }

  isTrue() {
    if(this.target.faction == "Village" || (this.target.faction == "Independent" && !(this.game.getRoleTags(this.target.role.name).includes("Hostile")))){
      if(this.mainInfo == "Innocent"){
        return true;
      }
    }
    else if(EVIL_FACTIONS.includes(this.target.faction) || (this.target.faction == "Independent" && this.game.getRoleTags(this.target.role.name).includes("Hostile"))){
        if(this.mainInfo == "Guilty"){
        return true;
      }
    }
    return false;
  }
  isFalse() {
    if(this.target.faction == "Village" || (this.target.faction == "Independent" && !(this.game.getRoleTags(this.target.role.name).includes("Hostile")))){
      if(this.mainInfo == "Guilty"){
        return true;
      }
    }
    else if(EVIL_FACTIONS.includes(this.target.faction) || (this.target.faction == "Independent" && this.game.getRoleTags(this.target.role.name).includes("Hostile"))){
        if(this.mainInfo == "Innocent"){
        return true;
      }
    }
    return false;
  }
  isFavorable(){
    if(this.mainInfo != "Innocent"){
      return false;
    }
    else{
      return true;
    }
  }
  isUnfavorable(){
    if(this.mainInfo == "Innocent"){
      return false;
    }
    else{
      return true;
    }
  }

  makeTrue() {
    if(EVIL_FACTIONS.includes(this.target.faction) || (this.target.faction == "Independent" && this.game.getRoleTags(this.target.role.name).includes("Hostile"))){
      this.mainInfo = "Guilty";
    }
    else{
      this.mainInfo = "Innocent";
    }
  }
  makeFalse() {
    if(EVIL_FACTIONS.includes(this.target.faction) || (this.target.faction == "Independent" && this.game.getRoleTags(this.target.role.name).includes("Hostile"))){
      this.mainInfo = "Innocent";
    }
    else{
          this.mainInfo = "Guilty";
      
    }
  }
  makeFavorable(){
      this.mainInfo = "Innocent";
  }
  makeUnfavorable(){
this.mainInfo = "Guilty";
  }
};