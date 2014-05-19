(function() {

	// Objeto que implementa o algoritmo ID3.


	var ID3 = function (dados, atributoAlvo) {

		this.atributoAlvo = atributoAlvo || dados.atributos[ dados.atributos.length -1 ];
		this.dados = dados;
		this.raiz = {
			dados: dados
		};
	};

	ID3.prototype.executar = function(nodo) {

		nodo = nodo || this.raiz;
		
		// Se todos os registros possuem mesma classificacao ou e restou apenas o atributo alvo.
		if (nodo.dados.todosRegistrosMesmoValor(this.atributoAlvo) ||
			nodo.dados.atributos.length == 1) {

			nodo.folha = true;
			nodo.classe = nodo.dados.getValorAtributo(0, this.atributoAlvo);
			nodo.nome = nodo.classe;

		} else {

			nodo.filhos = [];
			nodo.atributo = this.getAtributoMelhorClassificador(nodo);
			nodo.nome = nodo.atributo.nome;
			var particoes = nodo.dados.particionar(nodo.atributo);

			for (var valor in particoes) {

				var filho = {
					pai: nodo,
					dados: particoes[valor],
					valorClassificacao: valor
				};

				nodo.filhos.push(filho);
				this.executar(filho)
			}
		}
	}

	ID3.prototype.getAtributoMelhorClassificador = function(nodo) {
		
		var entropiaTotal = this.calcularEntropia(nodo.dados);
		var atributos = nodo.dados.atributos;
		var melhorAtributo, melhorGanho = -1;

		for (var i = 0; i < atributos.length; i++) {
			
			if (atributos[i].coluna == this.atributoAlvo.coluna) // Desconsiderando atributo alvo
				continue;

			var ganhoAtributo = entropiaTotal - this.calcularEntropiaAtributo(nodo.dados, atributos[i]);
			
			if (!melhorAtributo || ganhoAtributo > melhorGanho) { // se o ganho do atributo for maior

				melhorAtributo = atributos[i];
				melhorGanho = ganhoAtributo;
			}
		}

		return melhorAtributo;
	};

	ID3.prototype.calcularEntropia = function(dados, registrosConsiderados) {

		registrosConsiderados = registrosConsiderados || dados.registros;
		var frequencias = dados.getFrequenciaPorValorAtributo(this.atributoAlvo, registrosConsiderados);
		var total = registrosConsiderados.length;
		var soma = 0;
		var freq = 0;

		for (var valorAtributo in frequencias) {

			var proporcao = frequencias[valorAtributo] / total;
			soma += (-1) * (proporcao) * ( Math.log(proporcao) / Math.log(2) );
		}

		return soma;
	};

	ID3.prototype.calcularEntropiaAtributo = function(dados, atributo) {

		// console.log(">>> Calculando entropia Entropia " +  atributo.nome);
		var registrosPorValor = dados.getRegistrosPorValorAtributo(atributo);
		var soma = 0;
		var total = dados.registros.length;

		for (var valor in registrosPorValor) {

			var entropiaValor = this.calcularEntropia(dados, registrosPorValor[valor]);
			var proporcao = registrosPorValor[valor].length / total;
			soma += entropiaValor * proporcao;
			// console.log("------  Entropia valor " +  valor + " = " + entropiaValor + " || num registros = " + registrosPorValor[valor].length + " || total = " + total + " || proporcao = " + proporcao);
		}

		// console.log("==== Entropia " +  atributo.nome + " = " + soma);
		// console.log("   ");

		return soma;
	};

	window.id3 = window.id3 || {};
	window.id3.ID3 = ID3;
})();
