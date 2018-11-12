const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
    
    new() {
        return this.isStandard() || this._isPremium() || this_isAdmin();
    }
    
    create() {
        return this.new();
    }
    
    edit() {
        return this._isAdmin() || this._isPremium() || this._isStandard();
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this._isAdmin();
    }
}