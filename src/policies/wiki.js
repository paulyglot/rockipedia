const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
    
    new() {
        return this.isStandard() || this._isPremium() || this._isAdmin();
    }
    
    create() {
        return this.new();
    }
    
    edit() {
        return this.user != null;
    }

    update() {
        return this.edit();
    }
}