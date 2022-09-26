const mongoose=require('mongoose');
const mongoURI='mongodb+srv://user:Tc5eEWAkQbouGksK@cluster0.bu8jhpo.mongodb.net/notebookapp?retryWrites=true&w=majority'

const connectTomongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("connected to mongoose succcessfully😀.")
    })
}

module.exports=connectTomongo;
// Tc5eEWAkQbouGksK