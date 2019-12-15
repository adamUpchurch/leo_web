var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var UserSchema = new Schema ({
    first_name: {type: String, max: 100},
    family_name: {type: String, max: 100},
    username: {type: String, max: 100},
    googleID: {type: String},
    profile_pic: {type: String},
    native_language: {type: String},
});

//Virtual for author's fullname
UserSchema
    .virtual('name')
    .get(function() {
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for author's URL
UserSchema
    .virtual('url')
    .get(function(){
        return '/user/' +this._id
    })

// Virtual for author's URL
UserSchema
    .virtual('basic_info')
    .get(function(){
        let thisUser = {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            googleID: this.googleID,
            username: this.username,
        }
        return JSON.stringify(thisUser)
    })


module.exports = mongoose.model('User', UserSchema)