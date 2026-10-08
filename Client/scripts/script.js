const fotoVisualizar = document.getElementById("foto_visualizar"); 
const removeFoto = document.getElementById("remove_imagem"); // Pega a label de remover
const uploadFoto = document.getElementById("upload_imagem"); // Pega o input de arquivo
const labelUpload = document.getElementById("label_upload"); // Pega a label de adicionar

// Estado Inicial: Adicionar liberado, Remover bloqueado
removeFoto.classList.add("desabilitado");
labelUpload.classList.remove("desabilitado");

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
  console.log("IndexedDB pronto.");
  carregarFotoSalva();
};

function carregarFotoSalva() {
  if (!db) return;

  const transacao = db.transaction("fotos", "readonly");
  const tabela = transacao.objectStore("fotos");
  const consulta = tabela.get("foto_atual"); 

  consulta.onsuccess = function() {
    const registro = consulta.result;
    
    // Se achou uma foto no banco, exibe e altera o estado dos botões
    if (registro && registro.arquivo) {
      const urlTemporaria = URL.createObjectURL(registro.arquivo);
      fotoVisualizar.src = urlTemporaria;
      
      // ESTADO: Ativa Remover, Desativa Adicionar
      removeFoto.classList.remove("desabilitado"); 
      labelUpload.classList.add("desabilitado");
    }
  };
}

// EVENTO DE UPLOAD
uploadFoto.addEventListener('change', function (event) { 
  const arquivo = event.target.files[0]; // Captura o arquivo usando o índice correto

  if (arquivo && arquivo.type.startsWith('image/')) { 
    const urlTemporaria = URL.createObjectURL(arquivo);
    fotoVisualizar.src = urlTemporaria; 
    
    // ALTERAÇÃO DE ESTADO: Ativa Remover, Desativa Adicionar
    removeFoto.classList.remove("desabilitated"); // Limpeza de segurança
    removeFoto.classList.remove("desabilitado"); 
    labelUpload.classList.add("desabilitado"); 

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

// EVENTO DE REMOVER
removeFoto.onclick = function(e) {
    // Como é uma label, evitamos qualquer comportamento padrão do navegador
    e.preventDefault();

    const desejaRemover = confirm("Tem certeza de que deseja remover este QR Code?");
    
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
  
  // Volta para a imagem padrão do Sesi caso remova o QR Code
  fotoVisualizar.src = "https://images.seeklogo.com/logo-png/22/1/sesi-logo-png_seeklogo-223485.png"; 
  
  // RESET DE ESTADO: Bloqueia Remover, Libera Adicionar
  removeFoto.classList.add("desabilitado"); 
  labelUpload.classList.remove("desabilitado"); 
  uploadFoto.value = ""; // Reseta o input
}
