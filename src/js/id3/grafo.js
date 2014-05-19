(function(){

	var Grafo = function(selector) {

		this.sys = arbor.ParticleSystem(1000, 400,0);
		this.sys.parameters({gravity:true});
		this.sys.renderer = Renderer(selector) ;
		this.nodoCount = 0;
	};

	Grafo.prototype.renderizar = function(arvore) {

		this._adicionarNodo(arvore.raiz);
	};

	Grafo.prototype._adicionarNodo = function(nodo) {
		
		var nodoPai = this.sys.addNode("nodo" + this.nodoCount++, this._getNodoData(nodo));

		if (nodo.filhos) {

			for (var i = 0; i < nodo.filhos.length; i++) {

				var nodoValor = this.sys.addNode("nodo" + this.nodoCount++, {
					color: "none", 
					label: nodo.filhos[i].valorClassificacao
				});

				var nodoFilho = this._adicionarNodo(nodo.filhos[i]);

				this.sys.addEdge(nodoPai, nodoValor, { weight: 3 });
				this.sys.addEdge(nodoValor, nodoFilho, { weight: 3 });
			}
		}

		return nodoPai;
	};

	Grafo.prototype._getNodoData = function(nodo) {

		if (!nodo.pai) { // Nodo raiz

			return {
				'color': "#048CCC",
				'label':nodo.nome
			};
			
		} else if (nodo.folha) {
			
			return {
				'color': "green",
				'shape':'dot',
				'label':nodo.nome
			};

		} else {
			
			return {
				'color': "gray",
				'label':nodo.nome
			};			
		}
	};

	window.id3 = window.id3 || {};
	window.id3.Grafo = Grafo;
})();
