(function() {

	// Objeto responsável por manipular os dados para o algoritmo ID3


	var Dados = function(atributos, registros) {

		this.atributos = [];
		this.registros = registros || [];

		if (atributos) {

			for (var i = 0; i < atributos.length; i++)
				this.atributos.push(atributos[i]);
		}
	};

	// Cria objeto com os possíveis valores do atributo como chaves dos
	// atributos do objeto e a frequencia como sendo o valor dos atributos.
	// Por exemplo, cálculo para o atributo "tempo" :
	// {
	//     "sol": 4
	//     "chuvoso": 3	
	// }
	Dados.prototype.getFrequenciaPorValorAtributo = function(atributo, registrosConsiderados) {

		registrosConsiderados = registrosConsiderados || this.registros;
		var frequencias = {};

		for (var i = 0; i < registrosConsiderados.length; i++) {

			var valor = registrosConsiderados[i][atributo.coluna];

			if (!frequencias[valor])
				frequencias[valor] = 0;

			frequencias[valor]++;
		}

		return frequencias;
	};

	// Separa os registros de acordo com cada possível valor para o atributo
	Dados.prototype.getRegistrosPorValorAtributo = function(atributo) {

		var registrosPorValorAtributo = {};

		for (var i = 0; i < this.registros.length; i++) {

			var valor = this.registros[i][atributo.coluna];

			if (!registrosPorValorAtributo[valor])
				registrosPorValorAtributo[valor] = [];

			registrosPorValorAtributo[valor].push(this.registros[i]);
		}

		return registrosPorValorAtributo;
	};

	Dados.prototype.todosRegistrosMesmoValor = function(atributo) {
		
		if (this.registros.length < 2)
			return true;

		var valor = this.registros[0][atributo.coluna];

		for(var i = 1; i < this.registros.length; i++) {

			if (valor !== this.registros[i][atributo.coluna])
				return false;
		}

		return true;
	};

	Dados.prototype.getValorAtributo = function (numRegistro, atributo) {

		return this.registros[numRegistro][atributo.coluna];
	};

	Dados.prototype.particionar = function(atributo) {

		var registrosPorValor = this.getRegistrosPorValorAtributo(atributo);
		var particoes = {};
		var atributosParticoes = [];

		for (var i = 0; i < this.atributos.length; i++) {

			if (atributo.coluna != this.atributos[i].coluna) {
				atributosParticoes.push(this.atributos[i]);
			}
		} 

		for (var valor in registrosPorValor) {

			particoes[valor] = new Dados(atributosParticoes, registrosPorValor[valor]);
		}

		return particoes;
	};

	Dados.prototype.carregarTexto = function(texto) {

		var linhasTexto = texto.split("\n");
		this.registros = [];
		this.atributos = [];
		var i;

		var linha = linhasTexto[0].trim();
		var nomesAtributos = linha.split(",");

		for (i = 0; i < nomesAtributos.length; i++) {
			this.atributos.push({
				nome: nomesAtributos[i],
				coluna: i
			});
		}

		for (i = 1; i < linhasTexto.length; i++) {
			linha = linhasTexto[i].trim();

			if (linha.length > 0) {
				this.registros.push( linha.split(",") );
			}
		}
	};

	window.id3 = window.id3 || {};
	window.id3.Dados = Dados;
})();
