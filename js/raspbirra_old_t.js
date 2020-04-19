
// Colors elements raspbirra
rb_hmi_blanc = "#fff";
rb_hmi_vermell = "#edb1b1";
rb_hmi_verd = "#e1edb1";
rb_hmi_gris = "#d3d3d3";
rb_hmi_gris_fosc = "#A2A0A1";
rb_hmi_liquid = "#39b1ef";

/**
 * Classe per la gestió de la part visual del Raspbirra
 * @div_id (string): id html del div que contindrà el canvas
 * @width (float): Amplada del canvas
 * @height (float): alçada del canvas
 */
function raspbirra(div_id, width, height)
{
	// Tamanys configurables
	this.rb_olla_ample = 350;
	this.rb_olla_alt = 450;
	this.rb_olla_radi = 10;
	this.rb_temp_alt = 50;
	this.rb_temp_ample = 120;
	this.rb_tub_ample = 5;
	this.rb_valvula_h_alt = 25;
	this.rb_valvula_h_ample = 50;
	this.rb_valvula_v_alt = 50;
	this.rb_valvula_v_ample = 25;
	
	this.rb_marge_inicial_h = 125;
	this.rb_marge_h = 250;
	this.rb_marge_v = 60;

	this.paper = Raphael(div_id, width, height); 
	
	// TODO::Crear els objectes com a mètodes de la llibreria
	// TODO::Crear les 'T' com a elements diferenciats
	// TODO::Crear element 'X' 4 vies
	// TODO::Crear Valvula una direcció
	// TODO::Crear els tubs com a elements
	// TODO::Als elements relacionar l'objecte entrada i sortida
	// TODO::Als elements crear un array amb els objectes de RaphaelJS
	// TODO::Crear mètode als elements per canviar text, colorDepth
	// TODO::Afegir atribut als elements per indicar si té liquid a una de les dues entrades (entrada/sortida)
	// TODO::Crear mètode per canviar estat d'element i afectar a si hi ha líquid

	
	/**
	 * Objecte de RB per dibuixar un serpentí
	 * @param {raspbirra} Objecte principal raspbirra que conté l'instància de RaphaelJS
	 * @param {rb_olla} Objecte d'olla que contindrà l'indicador de temperatura per obtenir les coordenades
	 * @param {string} Identificació del serpentí
	 */
	this.coil = function(rb_olla, id)
	{
		var x = rb_olla.sortida.x; // Només pot ser una olla, TODO: Validar que és olla?
		var y = this.rb_marge_v + this.rb_olla_alt -160-100;
		var radi = 80;
		
		this.paper.circle(x-(this.rb_tub_ample/2), y+radi, radi);
		this.paper.circle(x-(this.rb_tub_ample/2), y+radi, radi-5);
		this.paper.circle(x-(this.rb_tub_ample/2), y+radi, radi-10);
		
		var linia = this.paper.path("M0,0L160,160M160,0L0,160")
		linia.translate(x-radi-(this.rb_tub_ample/2), y);
		var rb_coords_entrada = new rb_coords(x-80-(this.rb_tub_ample/2), y+160);
		var rb_coords_sortida = new rb_coords(x-80, y);
		
		var canviar_color = function(color){ };
		
		var canviar_text = function(text){  }
		
		return new rb_element("rb_coil_"+id, id, 0, new rb_coords(x,y), rb_coords_entrada, rb_coords_sortida, 1);
	}
	
	this.heating = function(rb_olla)
	{
		var radi = 25;
		var x = rb_olla.sortida.x-46;
		var y = rb_olla.sortida.y-50-50;
		
		var icon = this.paper.circle(rb_olla.sortida.x, rb_olla.sortida.y-50, radi);
		icon.attr({"fill":rb_hmi_blanc});
		var linia = this.paper.path("M20,50L30,50L35,40L40,60L45,40L50,60L55,40L60,60L65,50L72,50")
		linia.translate(x, y);	
		
		var canviar_color = function(color){ icon.attr({"fill":color}); };
		
		return new rb_element("rb_heating_", 0, 0, new rb_coords(x,y), {}, {}, 0, canviar_color);
	}

	/**
	 * Objecte de RB per dibuixar una olla
	 * @param {raspbirra} Objecte principal raspbirra que conté l'instància de RaphaelJS
	 * @param {string} Id de l'olla
	 * @param {string} Nom de l'olla que es mostrarà
	 */
	this.kettle = function(id, nom)
	{	
		// TODO: Permetre ubiicar la olla en una x,y determinada
		var x = this.rb_marge_inicial_h + ((id)*(this.rb_olla_ample+this.rb_marge_h));
		var y = this.rb_marge_v;
		var olla = this.paper.rect(x,
								 y,
								 this.rb_olla_ample,
								 this.rb_olla_alt,
								 this.rb_olla_radi);
							  
		olla.attr("fill", rb_hmi_gris);
		olla.attr("stroke", rb_hmi_gris);
		
		var k_liquid = this.paper.rect(x+15,
									   y+150,
									   this.rb_olla_ample-15-15,
									   this.rb_olla_alt-15-150,
									   this.rb_olla_radi);
							  
		k_liquid.attr("fill", rb_hmi_gris);
		k_liquid.attr("stroke", rb_hmi_gris);
		
		var canviar_color = function(color){ 
			k_liquid.attr({"fill":color}); 
		};
		
		
		var olla_txt = this.paper.text(x+(this.rb_olla_ample/2), this.rb_marge_v+30, nom)
		olla_txt.attr({ "font-size": 25});
		
		var rb_coords_sortida = new rb_coords(x+(this.rb_olla_ample/2)-(this.rb_tub_ample/2), this.rb_marge_v+this.rb_olla_alt);
		
		var rb_coords_entrada = {};
		if (id == 0)
			rb_coords_entrada = new rb_coords(this.rb_marge_inicial_h + ((id)*(this.rb_olla_ample+this.rb_marge_h))+this.rb_olla_ample-12, this.rb_marge_v+150+(this.rb_tub_ample/2));
		else 
			rb_coords_entrada = new rb_coords(this.rb_marge_inicial_h + ((id)*(this.rb_olla_ample+this.rb_marge_h))+12, this.rb_marge_v+150+(this.rb_tub_ample/2));
		
		return new rb_element("rb_kettle_"+id, nom, 0, new rb_coords(x,y), rb_coords_entrada, rb_coords_sortida, 0, canviar_color);
	}
	
	this.pump = function(x, y, id, _funcio_clicar)
	{
		var radi = 30;
		var cercle = this.paper.circle(x, y+radi, radi);
		cercle.attr({"stroke-width": 3, fill: rb_hmi_vermell});
		
		var linia = this.paper.path("M5,12L30,60L55,12")
		linia.translate(x-radi, y);
		
		var text = this.paper.text(x-radi*1.5, y+radi, id);
		
		bomba = this.paper.set(cercle, text);
		bomba.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
		
		var rb_coords_entrada = new rb_coords(x,y);
		var rb_coords_sortida = new rb_coords(x,y+(radi*2));
		
		var canviar_color = function(color){ cercle.attr({"fill":color}); };
		var canviar_text = function(texte){ text.attr({"text":texte}); };
		
		var rb_elem = new rb_element("rb_pump_"+id, id, 0, new rb_coords(x,y), rb_coords_entrada, rb_coords_sortida, 0, canviar_color, canviar_text);
		
		bomba.click(function(event) {
			console.log("Bomba::" + rb_elem.estat);
			rb_elem.set_stat(Math.abs(rb_elem.estat-1));
			if (_funcio_clicar != undefined)
				_funcio_clicar();
		});
		
		return rb_elem;
	}
	
	/**
	 * Objecte de RB per dibuixar l'indicador de temperatura de l'olla
	 * @param {raspbirra} Objecte principal raspbirra que conté l'instància de RaphaelJS
	 * @param {rb_olla} Objecte d'olla que contindrà l'indicador de temperatura per obtenir les coordenades
	 * @param {string} Identificació del indicador de temperatura
	 * @param {bool} En cas de ser verdader es mostrarà un botó per modificar la temperatura consigna
	 * @param {function} Mètode que es cridarà al clicar sobre el botó per canviar la consigna
	 */
	this.thermometer = function(rb_olla, _id, es_editable)
	{
		this.id = _id;
		
		var marge_alt_elem = 65;
		var x = rb_olla.sortida.x-(this.rb_temp_ample/2);
		var y = this.rb_marge_v+marge_alt_elem;
		
		var fons = this.paper.rect(x, y, this.rb_temp_ample, this.rb_temp_alt);
		fons.attr({"fill": rb_hmi_blanc});
		var txt = this.paper.text(rb_olla.sortida.x, this.rb_marge_v+marge_alt_elem+this.rb_temp_alt/2, "17,678 ºC");
		txt.attr({ "font-size": 25});
		
		var txt_o = {};
		if (es_editable == 1)
		{
			var fons_o = this.paper.rect(rb_olla.sortida.x-(this.rb_temp_ample/2), this.rb_marge_v+marge_alt_elem+this.rb_temp_alt, this.rb_temp_ample, 20);
			fons_o.attr({"fill": "#ffb907"});
			txt_o = this.paper.text(rb_olla.sortida.x, this.rb_marge_v+marge_alt_elem+this.rb_temp_alt+20/2, "Consigna: 65ºC");
			txt_o.attr({ "font-size": 12});
			
			var configurador = this.paper.set(fons_o, txt_o);
			configurador.click(function(event) {
				alert("Modificar temp!");
			});
			
			configurador.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});		
		}
		
		var canviar_text = function(texte, es_consigna){ if (!es_consigna) icon.attr({"text":texte}); else txt_o.attr({ "text": 12});};
		
		return new rb_element("rb_therm_" + _id, _id, -1, new rb_coords(x,y), {},{}, 0, {}, canviar_text);
	}
	
	/**
	 * raspbirra Object for draw a T. Permit connect 3 tubes in same element ALWAYS opened.
	 * @param {string} Element ID
	 * @param {string} Coord X: Center of the element
	 * @param {string} Coord y: Center of the element
	 * @param {int} up/down (1/0) for draw the three tub up or down
	 */
	this.t = function(id, x, y, up)
	{
		var _coords_center = new rb_coords(x, y);
		
		var _coords_entrada = new rb_coords(x-18,y);
		var _coords_sortida = new rb_coords(x+18,y);
		var _coords_auxiliar = new rb_coords(x, (up == 1 ? y-18 : y+18));
		
		var linia = "M" + _coords_center.get_rs_coord() + "L" + _coords_entrada.get_rs_coord() + 
					"M" + _coords_center.get_rs_coord() + "L" + _coords_sortida.get_rs_coord() +
					"M" + _coords_center.get_rs_coord() + "L" + _coords_auxiliar.get_rs_coord();
		
		var t = this.paper.path(linia);
		tub1.attr({"stroke-width": 5,"stroke":rb_hmi_gris_fosc});
		
		var canviar_color = function(color){ tub1.attr({"stroke":color}); };
		
		return new rb_element("rb_t_" + id, id, 1, {}, _coords_entrada, _coords_sortida, 1, _funcio_color, {}, _coords_auxiliar)
		//return new rb_tub("rb_t_" + id, id, [rb_elem_1, rb_elem_2, rb_elem_3], ruta_inversa, canviar_color)
	}
	
	/**
	 * Objecte de RB per dibuixar un tub
	 * @param {raspirra} Decimal que indica la temperatura
	 */
	this.tub = function(id, rb_elem_1, rb_elem_2, punts_intermitjos, davant, ruta_inversa)// punts_intermitjos::Possibilitat de fer línies quadrades:: LX,YL...
	{
		// TODO: Al crear un tub aquest es connecta a un element a la sortida i a un altre a l'entrada. Assignar-los per poder fer les aigües avall.
		var tub_codi = "M" + rb_elem_1.sortida.get_rs_coord();
		tub_codi += String(punts_intermitjos) != "undefined" ? String(punts_intermitjos) : "";
		tub_codi += "L" + rb_elem_2.entrada.get_rs_coord();

		var tub = this.paper.path(tub_codi);
		tub.attr({"stroke-width": 5,"stroke":rb_hmi_gris_fosc});
		if (davant==undefined)
			tub.toBack();
		else
			tub.toFront();
		
		var canviar_color = function(color){ tub.attr({"stroke":color}); };
		
		return new rb_tub("rb_tube_" + id, id, [rb_elem_1, rb_elem_2], ruta_inversa, canviar_color);
	}
	
	this.valve_h = function(x, y, id, inversa, _funcio_clicar)
	{
		var x_int = x-this.rb_valvula_h_ample;
		var y_int = y-(this.rb_valvula_h_ample/4);
		
		var v = this.paper.path("M0,0L25,12.5L50,0L50,25L25,12.5L0,25Z")
		v.translate(x_int, y_int);
		
		v.attr({"stroke-width": 3, fill: rb_hmi_vermell});
		
		var text = this.paper.text(x_int+(this.rb_valvula_h_ample/2), y_int+(this.rb_valvula_h_ample/2), id);
		
		var valvula = this.paper.set(v, text);
		valvula.click(function(event) {
			if (_funcio_clicar != undefined)
				_funcio_clicar();
		});
		valvula.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
		
		var rb_coords_entrada = new rb_coords(x_int,y);
		var rb_coords_sortida = new rb_coords(x_int+this.rb_valvula_h_ample, y);
		if (inversa==1)
		{
			var aux = rb_coords_sortida;
			rb_coords_sortida = rb_coords_entrada;
			rb_coords_entrada = aux;
		}
		var canviar_color = function(color){ v.attr({"fill":color}); };
		var canviar_text = function(texte){ text.attr({"text":texte}); };
		
		var rb_elem = new rb_element("rb_valv_"+id, id, 0, new rb_coords(x,y), rb_coords_entrada, rb_coords_sortida, 1, canviar_color, canviar_text);
		
		valvula.click(function(event) {
			// Canviar d'estat l'element i avisar la sortida (i si bi tb l'entrada) del canvi d'estat
			console.log("Valvula_h::" + rb_elem.estat);
			
			rb_elem.set_stat(Math.abs(rb_elem.estat-1));
						
			if (_funcio_clicar != undefined)
				_funcio_clicar();
		});
		
		return rb_elem;
	}

	this.valve_v = function(x, y, id, _funcio_clicar)
	{
		x = x-(this.rb_valvula_v_ample/2);
		var v = this.paper.path("M0,0L25,0L12.5,25L25,50L0,50L12.5,25Z")
		v.translate(x, y);
		
		v.attr({"stroke-width": 3, fill: rb_hmi_vermell});
		
		var rb_text = this.paper.text(x-this.rb_valvula_v_ample/2, y+this.rb_valvula_v_alt/2, id);
		
		var valvula = this.paper.set(v, rb_text);
		
		valvula.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
			
		var rb_coords_entrada = new rb_coords(x+(this.rb_valvula_v_ample/2), y);
		var rb_coords_sortida = new rb_coords(x+(this.rb_valvula_v_ample/2), y+this.rb_valvula_v_alt);
		
		var canviar_color = function(color){
			v.attr({fill: color});
		}
		
		var canviar_text = function(text){
			rb_text.attr({"text": text});
		}
		
		var rb_elem = new rb_element("rb_valv_"+id, id, 0, new rb_coords(x,y), rb_coords_entrada, rb_coords_sortida, 1, canviar_color, canviar_text);
		
		valvula.click(function(event) {
			// Canviar d'estat l'element i avisar la sortida (i si bi tb l'entrada) del canvi d'estat
			console.log("Valvula_v" + rb_elem.id +"_" + rb_elem.nom+"::" + rb_elem.estat);
			
			rb_elem.set_stat(Math.abs(rb_elem.estat-1));
						
			if (_funcio_clicar != undefined)
				_funcio_clicar();
		});
		
		return rb_elem;
	}
	
	/* Mètodes privats */
	/**
	 * Objecte generic de RB, d'aquest hereden els objectes olla, temperatura, resistencia, tub, vàlvula, bomba,...
	 * @param {string} Id del element
	 * @param {string} Nom del element
	 * @param {rb_coords} Coordenades a on s'ha de dibuixar l'element
	 * @param {rb_coords} Indica el la posició x,y del vèrtex d'entrada
	 * @param {rb_coords} Indica el la posició x,y del vèrtex de sortida
	 * @param {bool} Indica si l'element es pot clicar, per tant al passar per sobre s'escalen els elements i es canvia el punter 
	 * @param {bool} Indica si l'element permet circular líquid en els dos sentits 
	 */
	function rb_element(_id, _nom, _estat, _coords, _coords_entrada, _coords_sortida, _bidireccional, _funcio_color, _funcio_text, _coords_auxiliar)
	{
		this.id = _id,
		this.nom = _nom;
		this.coords = _coords;
		this.entrada = _coords_entrada;
		this.sortida = _coords_sortida;
		this.auxiliar = _coords_auxiliar;
		this.tub_entrada = {};  // Element Raspbirra connectat a l'entrada. Serveix per poder controlar l'aigües amunt.
		this.tub_sortida = {};  // Element Raspbirra connectat a la sortida. Serveix per poder controlar l'aigües avall.
		this.bidireccional = _bidireccional
		
		this.liquid = 0;
		this.estat = _estat; // Estat del objecte (encès/parat). Si no té estat o és indeterminat queda a -1.
		
		this.funcio_color = _funcio_color;
		
		this.set_tube_in = function(rb_tube)
		{
			this.tub_entrada = rb_tube;
		}
		
		this.set_tube_out = function(rb_tube)
		{
			this.tub_sortida = rb_tube;
		}
		
		this.set_color = function(color)
		{
			_funcio_color(color);
		}
		
		// TODO: Enllaçar l'objecte que té el text per poder modificar (temp, consigna)
		this.set_text = function(text) {
			_funcio_text(text);
		};
		
		
		this.set_liquid = function(new_stat, id_origen)
		{
			console.log("rb_element::"+this.id+"::set_liquid::"+new_stat+"::Origen::"+id_origen);
			this.liquid = new_stat;
			
			if (this.id.substring(0, 7)=="rb_pump" || this.id.substring(0, 7)=="rb_valv"){
				if (this.estat == 0) 
					return;
			} 
			else if (this.id.substring(0, 9)=="rb_kettle")
			{
				if (this.liquid==1)
					this.set_color(rb_hmi_liquid);
				else
					this.set_color(rb_hmi_gris);
			}
			
			if (this.tub_sortida != {} && this.tub_sortida.id != id_origen)
				this.tub_sortida.set_liquid(new_stat, this.id);
			
			if (this.bidireccional==1 && this.tub_entrada != {} && this.tub_entrada.id != id_origen)
				this.tub_entrada.set_liquid(new_stat, this.id);
		}
		
		/**
		 * Objecte generic de RB, d'aquest hereden els objectes olla, temperatura, resistencia, tub, vàlvula, bomba,...
		 * @param {int} Enter que indica l'estat de l'element (0: Tancat, 1: Obert)
		 */
		this.set_stat = function(new_stat)
		{
			console.log("rb_element::"+this.id+"::set_stat::"+new_stat);
			this.estat = new_stat;
			
			if (this.estat == 0)
				this.set_color(rb_hmi_vermell);
			else if (this.estat == 1)
				this.set_color(rb_hmi_verd);
			else 
				this.set_color(rb_hmi_blanc);
			
			if (this.bidireccional==1)
			{
				// ULL!!! Les bidireccionals no s'han de limitar la sortida al tancar!
				if(this.tub_sortida != {} && this.tub_entrada != {})
				{
					if (new_stat==0)
					{
						console.log("rb_elem::set_stat::new_stat==0");
						this.tub_sortida.set_liquid(0);
					}
					else
					{
						// Possibilitats quan s'obre la vàlvula
						// 1 - Líquid als dos costats -> Vàlvula liquid=1 no fer res
						// 2 - Líquid a cap dels costats -> Vàlvula liquid=0 no fer res
						console.log("rb_element::"+this.id+"::Entrada i sortida assignades::" +this.tub_entrada.id+"::"+this.tub_sortida.id);
						if (this.tub_entrada.liquid==this.tub_sortida.liquid)
							this.liquid=this.liquid;
						else {
							if (this.tub_entrada.liquid==1) // 3 - Líquid a l'entrada -> Líquid a 1 i sortida liquid a 1
								this.tub_sortida.set_liquid(this.tub_entrada.liquid, this.id);	
							else 
								// 4 - Líquid a la sortida -> Líquid a 1 i entrada liquid a 1
								this.tub_entrada.set_liquid(this.tub_sortida.liquid, this.id);	
						}						
					}
				}
			}
			else
			{
				if(this.tub_sortida != {} && this.tub_entrada != {})
				{
					if (new_stat==0)
						this.tub_sortida.set_liquid(0);
					else
						this.tub_sortida.set_liquid(this.tub_entrada.liquid);
				}
			}
		}
		
		// TODO: Funció a executar quan es cliqui a sobre (bomba, vàlvula, consigna)
		this.rb_onclick = function(event) {
			
		}
	}
	
	function rb_tub(_id, _nom, _arr_elements, ruta_inversa, _funcio_color)
	{
		var funcio_color = _funcio_color;
		var arr_elements = _arr_elements;
		
		this.id = _id;
		this.nom = _nom;
		this.liquid = 0;
		this.estat = -1; // Estat del objecte (encès/parat). Si no té estat o és indeterminat queda a -1.
		
		this.set_color = function(color)
		{
			funcio_color(color);
		}
		
		this.set_liquid = function(new_stat, id_origen)
		{
			console.log("rb_tub::"+this.id+"::set_liquid::"+new_stat+"::Origen::"+ id_origen);
			this.liquid = new_stat;
			if (this.liquid==1)
				this.set_color(rb_hmi_liquid);
			else
				this.set_color(rb_hmi_gris);
			
			for (i =0;i<arr_elements.length;i++){
				if (arr_elements[i].id!=id_origen){
					console.log("rb_tub::" + this.id+"::set_liquid::Origen::" + id_origen + "::element_cridat_set_liquid::" +arr_elements[i].id)
					arr_elements[i].set_liquid(new_stat, this.id);
				}
				
			}
			/*if (this.tub_sortida != {})
				this.tub_sortida.set_liquid(new_stat);
			if (this.bidireccional==1 && this.tub_entrada != {})
				this.tub_entrada.set_liquid(new_stat);*/
		}
		
		this.set_stat = function(new_stat)
		{
			// Comprovar el nou estat si és igual que el mateix ignorar
			
			// Si és diferent, 
			this.estat = new_stat;
			// Canviar color de la línia
			// Recorrer tots els elements en busca de l'origen, i canviar l'estat de la resta d'elements
		}
		if (ruta_inversa==1)
		{
			arr_elements[0].set_tube_in(this);
			for (i =1;i < arr_elements.length;i++)
			{
				arr_elements[i].set_tube_out(this);
			}
		}
		else{
			arr_elements[0].set_tube_out(this);
			for (i =1;i < arr_elements.length;i++)
			{
				arr_elements[i].set_tube_in(this);
			}
		}
	}
		
	/**
	 * Objecte coordenades.
	 * @param {float} Indica la coordenada x
	 * @param {float} Indica la coordenada y
	 */
	function rb_coords(_x, _y)
	{
		this.x = _x;
		this.y = _y;
		
		/**
		 * Funció que retorna les coordenades amb format RaphaelJS
		 * @returns {string} coordenades separades per comes (format RaphaelJS)
		 */
		this.get_rs_coord = function() { return String(this.x) + "," + String(this.y);};
	}
}
