(function() {

	$("#processar").click( function() {

		var dadosTexto = $("#inputDados").val();
		
		var dados = new id3.Dados();
		dados.carregarTexto(dadosTexto);

		var algoritmoID3 = new id3.ID3(dados);
		algoritmoID3.executar();

		var grafo = new id3.Grafo("#viewport");
		grafo.renderizar(algoritmoID3);
	});

	$(".dado-exemplo").click( function(e){
		var dados = id3.exemplos[e.target.id];
		$("#inputDados").val(dados);
	});
})();
