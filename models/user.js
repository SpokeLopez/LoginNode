var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://localhost/fotos");
var posibles_valores = ["M","H"];
var email_math = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un email válido"];
var password_validation = {
    validator: function (p) {
        return this.password_confirmation == p;
    },
    message: "Las contraseñas no coinciden"
}
var user_schema = new Schema({
    name: String,
    last_name: String,
    username: {
        type: String,
        required: "El nombre de usuario es obligatorio",
        maxlenght: [50,"El Username es muy largo"]
    },
    password: {
        type: String,
        required: true,
        minlenght: [8,"Contraseña muy corta"],
        validate: password_validation
    },
    age: {
        type: Number,
        min:[5,"La edad no puede ser menor a 5"],
        max:[100,"La edad no puede ser mayor a 100"]
    },
    email: {
        type:String,
        required: "El correo es obligatorio",
        math: email_math
    },
    date_of_birth: Date,
    sex: {
        type: String,
        enum: {
            values: posibles_valores,
            message: "Opción no válida"
        }
    }
});
user_schema.virtual("password_confirmation")
    .get(function () {
        return this.p_c;
    })
    .set(function (password) {
        this.p_c = password;
    });
var User = mongoose.model("User",user_schema);
module.exports.User = User;