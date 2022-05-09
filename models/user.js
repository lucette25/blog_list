const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username:{
    type: String,
    minLength: 3,
    unique: [true, 'username must be unique'],
    required: [true, 'username is  required']
  },
  name: String,
  passwordHash: {
    type: String,
    minLength: 3,
    required: [true, 'user password is  required']
  },
  blogs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User