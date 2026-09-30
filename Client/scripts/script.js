const fotoVisualizar = document.getElementById ("foto_visualizar"); //Pega o Id do elemento HTML - foto_visualizar

const removeFoto = document.getElementById("remove_imagem")

const uploadFoto = document.getElementById("upload_imagem"); //Pega o Id do elemento HTML - upload_imagem

removeFoto.disabled = true;

uploadFoto.addEventListener('change', function (event) { // na variável uploadFoto (que pega o id de upload_imagem) adicionamos um evento que irá 'ouvir' o que será feito (ex: click ou change) e o valor dessa escuta vai para variável event (ela é a variável de entrada)
  const arquivo = event.target.files[0]; //cria uma variável que colocará esse valor de event dentro de uma array denominando sempre o que vir como primeiro

  if (arquivo && arquivo.type.startsWith('image/')) { //Se houver arquivo e o tipo do arquivo foi 'image/*' (qualquer tipo de arquivo imagem)
    fotoVisualizar.src = URL.createObjectURL(arquivo); //Usa uma API nativa para gerar uma URL temporária e joga o elemento de upload foto para dentro do elemento img do html

    removeFoto.style = "pointer-events:all ; opacity: 100 ;";
    removeFoto.disabled = false;
  } else { //Caso a validação não seja atendida
    fotoVisualizar.src = ""; //deixa o elemento vázio e dá um aviso.
    alert("Por favor, selecione um arquivo de imagem válido.");
  }
});

removeFoto.onclick = function(){
    var confirmar = confirm("Deseja realmente excluir?")

    if(confirmar == true){
      fotoVisualizar.src = '';
      removeFoto.style = "pointer-events:none; opacity: 0.5";
    } 
};



