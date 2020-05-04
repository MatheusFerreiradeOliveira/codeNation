const axios = require('axios');
const sha1 = require('js-sha1');
const fs = require('fs');

let api = axios.create();

api.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=76a3d8adba6b2f16436d99570f8bc94e0e2d6b86')
    .then((response) => {
        let numero_casas = response.data.numero_casas;
        let token = response.data.token;
        let cifrado = response.data.cifrado.toLowerCase();
        let decifrado = response.data.decifrado;
        let resumo_criptografico = response.data.resumo_criptografico;

        for(let i = 0; i < cifrado.length; i++) {
        

            let letter = cifrado.charCodeAt(i);

            if(letter < 97 || letter> 122) {
                decifrado = decifrado + cifrado[i];
                continue;
            }


            letter = letter - numero_casas;

            if(letter < 97) {
                letter = letter + 26
            } 

            decifrado += String.fromCharCode(letter)
        }
        console.log(cifrado)
        console.log(decifrado)
        sha1(decifrado);
        var hash = sha1.create();
        hash.update(decifrado);
        resumo_criptografico = hash.hex();

        const ans = {
            numero_casas,
            token,
            cifrado,
            decifrado,
            resumo_criptografico
        }

        //Conversão e escrita no arquivo
        const jsonString = JSON.stringify(ans)
        fs.writeFile('./answer.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    })
    .catch((err) => {
        console.log(err)
    })