const fotoVisualizar = document.getElementById("foto_visualizar"); 
const removeFoto = document.getElementById("remove_imagem");
const uploadFoto = document.getElementById("upload_imagem"); 

removeFoto.classList.add("desabilitado");

let db = null;
const request = indexedDB.open("GaleriaDB", 1);

request.onupgradeneeded = function(event) {
  const banco = event.target.result;
  if (!banco.objectStoreNames.contains("fotos")) {
    banco.createObjectStore("fotos", { keyPath: "id" });
  }
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("IndexedDB conectado.");
  carregarFotoSalva();
};

function carregarFotoSalva() {
  if (!db) return;

  const transacao = db.transaction("fotos", "readonly");
  const tabela = transacao.objectStore("fotos");
  const consulta = tabela.get("foto_atual"); 

  consulta.onsuccess = function() {
    const registro = consulta.result;
    
    if (registro && registro.arquivo) {
      const urlTemporaria = URL.createObjectURL(registro.arquivo);
      fotoVisualizar.src = urlTemporaria;
      removeFoto.classList.remove("desabilitado"); 
    }
  };
}

// EVENTO DE UPLOAD DE FOTO (Com validação de foto única)
uploadFoto.addEventListener('change', function (event) { 
  // 👉 REQUISITO: Se o src da imagem já tiver um blob ativo, bloqueia o upload
  if (fotoVisualizar.src && fotoVisualizar.src.startsWith('blob:')) {
    alert("Já existe uma foto salva! Remova a foto atual antes de adicionar uma nova.");
    uploadFoto.value = ""; // Limpa a nova seleção para não bugar o input
    return; // Para a execução do código aqui
  }

  const arquivo = event.target.files[0]; 

  if (arquivo && arquivo.type.startsWith('image/')) { 
    const urlTemporaria = URL.createObjectURL(arquivo);
    fotoVisualizar.src = urlTemporaria; 
    removeFoto.classList.remove("desabilitated"); 
    removeFoto.classList.remove("desabilitado"); 

    const registroFoto = {
      id: "foto_atual", 
      nomeArquivo: arquivo.name,
      tipo: arquivo.type,
      dataCriacao: new Date().toISOString(),
      tamanho: arquivo.size,
      arquivo: arquivo 
    };

    if (db) {
      const transacao = db.transaction("fotos", "readwrite");
      const tabela = transacao.objectStore("fotos");
      tabela.put(registroFoto); 
    }

  } else { 
    limparInterface();
    alert("Por favor, selecione um arquivo de imagem válido.");
  }
});

removeFoto.onclick = function() {
    const desejaRemover = confirm("Tem certeza de que deseja remover esta foto?");

    
    if (desejaRemover && db) {
        const transacao = db.transaction("fotos", "readwrite");
        const tabela = transacao.objectStore("fotos");
        const requestDelete = tabela.delete("foto_atual");

        requestDelete.onsuccess = function() {
          limparInterface();
        };
    }
};

function limparInterface() {
  if (fotoVisualizar.src && fotoVisualizar.src.startsWith('blob:')) {
    URL.revokeObjectURL(fotoVisualizar.src);
  }
  fotoVisualizar.src = "https://images.seeklogo.com/logo-png/22/1/sesi-logo-png_seeklogo-223485.png"; 
  removeFoto.classList.add("desabilitado"); 
  uploadFoto.value = ""; 
}
