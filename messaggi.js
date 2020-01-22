var fs = require("fs")
var contents;
var delimita = "messages$"
contents = fs.readFileSync("users.json");
var userray = [];
userray = JSON.parse(contents);
contents = fs.readFileSync("messages.json");
var messarray = [];
messarray = JSON.parse(contents);



var control = new controllo(userray);
var salva = new salva();

var vorpal = require('vorpal')(),

    user_name = ""
detinatario = ""

// duck

vorpal
    .command('Registra [username][password]', 'Crea un nuovo account')
    .action((args, callback) => {
        // no cheating

        if (control.verificaEsistenza(args.username) === true) {
            console.log("utente gia utilizzato!")

        } else {
            salva.salvaUtente(args.username, args.password);
        }
        callback();

    });
vorpal
    .command('Login [username][password]', 'Entra in un account')
    .action((args, callback) => {

        if (control.verificaCongruenza(args.username, args.password) === true) {
            console.log("Login effettuato!");
            delimita = "messages/" + args.username + "$";
            user_name = args.username;

        } else {
            console.log("Username o password errati!");

        }
        callback();

    });
vorpal
    .command('Logout', 'Esci dal tuo account')
    .action((args, callback) => {


        console.log("Logout effettuato!");
        delimita = "messages$";
        user_name = "";

        callback();

    });
vorpal
    .command('Scrivi a [destinatario] "[messaggio]"', 'Scrivi un messaggio a qualcuno')
    .action((args, callback) => {

        if (user_name === "") {
            console.log("Effettuare prima il login!");
            callback();
        } else if (control.verificaEsistenza(args.destinatario) === true) {

            salva.salvaMessaggio(user_name, args.destinatario, args.messaggio);
            console.log("Messaggio inviato !");

        } else {
            console.log("Destinatario inesistente! ");
        }
        callback();

    });
vorpal
    .command('Vedi messaggi inviati', 'Vedi tutti i tuoi messaggi inviati')
    .action((args, callback) => {
        console.log("I tuoi messaggi inviati:\r\n")
        for (i in messarray.contact) {
            if (messarray.contact[i].username === user_name)
                console.log("Destinatario:" + messarray.contact[i].destinatario + ",Testo del messaggio:" + messarray.contact[i].messaggio + "\n\r");
        }
        callback();

    });
vorpal
    .command('Vedi messaggi ricevuti', 'Vedi tutti i tuoi messaggi ricevuti')
    .action((args, callback) => {
        console.log("I tuoi messaggi ricevuti:\r\n")
        for (i in messarray.contact) {
            if (messarray.contact[i].destinatario === user_name)
                console.log("Mittente:" + messarray.contact[i].username + ",Testo del messaggio:" + messarray.contact[i].messaggio + "\n\r");
        }
        callback();

    });
vorpal
    .command('Elimina messaggi [destinatario]', 'Elimina tutti i messaggi inviati ad un certo destinatario ')
    .action((args, callback) => {
        for (i in messarray.contact) {
            if (messarray.contact[i].username == user_name && messarray.contact[i].destinatario == args.destinatario) {
                delete messarray.contact[i];
            }

        }
        console.log("eliminazione completata!");
        callback();

    });
vorpal
    .delimiter(delimita)
    .show();

function controllo(user) {
    let j = 0;


}

function controllo(array) {
    var _array = array

    controllo.prototype.verificaEsistenza = function(user) {
        for (i in userray.contact) {
            if (userray.contact[i].username === user) {
                return true;
            }

        }
        return false;
    };
    controllo.prototype.verificaCongruenza = function(user, psw) {
        for (i in userray.contact) {
            if (userray.contact[i].username === user && userray.contact[i].password === psw) {
                return true;
            }

        }
        return false;
    };

}

function salva() {


    salva.prototype.salvaUtente = function(user, password) {
        var jsonobj = { "username": user, "password": password };

        userray.contact.push(jsonobj);
        var s = JSON.stringify(userray, null, 2);
        fs.writeFile('users.json', s, function(err) { if (err) return console.error(err) });
    };
    salva.prototype.salvaMessaggio = function(user, destinatario, messaggio) {
        var jsonobj = [{ "username": user, "destinatario": destinatario, "messaggio": messaggio }];
        messarray.contact.push(jsonobj);
        var s = JSON.stringify(messarray, null, 2);
        fs.writeFile('messages.json', s, function(err) { if (err) return console.error(err) });
    };


}