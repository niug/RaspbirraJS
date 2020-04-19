
// Colors elements raspbirra
rb_hmi_white = "#fff";
rb_hmi_red = "#edb1b1";
rb_hmi_green = "#e1edb1";
rb_hmi_grey = "#d3d3d3";
rb_hmi_darkgrey = "#A2A0A1";
rb_hmi_liquid = "#39b1ef";
rb_hmi_wort = "#edaa44";

/**
 * Library for help to develop a front-end for the visual interface of the raspbirra system using canvas library RaphaelJS
 * @param {string} html Id from the element that will have the workspace
 * @param {float} Workspace canvas width 
 * @param {float} Workspace canvas height
 * @returns {raspbirra} Frontend object for draw and handle the raspbirra human machine interface (HMI)
 */
function raspbirra(div_id, width, height)
{
	this.rb_kettle_width = 300;
	this.rb_kettle_height = 450;
	this.rb_kettle_radi = 10;
	this.rb_temp_height = 50;
	this.rb_temp_width = 120;
	this.rb_thread_width = 5;
	this.rb_valve_h_height = 25;
	this.rb_valve_h_width = 50;
	this.rb_valve_v_height = 50;
	this.rb_valve_v_width = 25;
	
	this.rb_margin_initial_h = 125;
	this.rb_margin_h = 250;
	this.rb_margin_v = 60;

	this.paper = Raphael(div_id, width, height); 
	
	// TODO::Crear element 'X' 4 vies
	// TODO::Hi ha algun problema puntual al tancar una vàlvula bidireccional, queda liquid als threads T
	// TODO::Crear rb_element de valvula manual

	/**
	 * raspbirra method for draw a coil into a kettle and returns a raspbirra element Object for interactuate from front-end
	 * @param {rb_element} Kettle object that have the coil inside
	 * @param {string} Coil ID
	 * @returns {rb_element} raspbirra element Object
	 */
	this.coil = function(rb_kettle, id)
	{
		var x = rb_kettle.out.x; // Només pot ser una kettle, TODO: Validar que és kettle!
		var y = this.rb_margin_v + this.rb_kettle_height -160-100;
		var radi = 80;
		
		this.paper.circle(x-(this.rb_thread_width/2), y+radi, radi);
		this.paper.circle(x-(this.rb_thread_width/2), y+radi, radi-5);
		this.paper.circle(x-(this.rb_thread_width/2), y+radi, radi-10);
		
		var linia = this.paper.path("M0,0L160,160M160,0L0,160")
		linia.translate(x-radi-(this.rb_thread_width/2), y);
		var rb_coords_in = new rb_coords(x-80-(this.rb_thread_width/2), y+160);
		var rb_coords_out = new rb_coords(x-80, y);
		
		return new rb_element("rb_coil_"+id, id, 0, new rb_coords(x,y), rb_coords_in, rb_coords_out, 1);
	}
	
	/**
	 * raspbirra method for draw a fermenter in workspace and returns a raspbirra element Object for interactuate from front-end
	 * @returns {rb_element} raspbirra element Object
	 */
	this.fermenter = function() //TODO: Draw in a specific x,y, width and height
	{
		var fermenter_width = 120;
		
		var x = this.rb_margin_initial_h + ((2)*(this.rb_kettle_width+this.rb_margin_h)) + (this.rb_kettle_width/2 - fermenter_width/2)+1.5; // Col·loquem el fermentador sota l'olla de bullit
		var y = this.rb_margin_v + this.rb_kettle_height + 170;
		
		var fermentador = this.paper.path("M" + x + "," + y + 
										  "L" + (x+120) + "," + y + 
										  "L" + (x+120) + "," + (y+70) + 
										  "L" + (x+60) + "," + (y+120) + 
										  "L" + (x) + "," + (y+70) + "Z");
		fermentador.attr("fill", rb_hmi_grey);
		fermentador.attr("stroke", rb_hmi_grey);
		
		var fermentador_liq = this.paper.path("M" + (x+10) + "," + (y+40) + 
										  "L" + (x+110) + "," + (y+40) + 
										  "L" + (x+110) + "," + (y+65) + 
										  "L" + (x+60) + "," + (y+108) + 
										  "L" + (x+10) + "," + (y+65) + "Z");
										  
		fermentador_liq.attr("fill", rb_hmi_grey);
		fermentador_liq.attr("stroke", rb_hmi_grey);
		
		var ferm_txt = this.paper.text(x+60, y+20, "Ferm.")
		ferm_txt.attr({ "font-size": 18});
		
		var coords = new rb_coords(x+60-(this.rb_thread_width/2)-1.5, y);
		
		var canviar_color = function(color){ 
			fermentador_liq.attr({"fill":color}); 
		};
		
		return new rb_element("rb_fermenter", "F0", 0, coords, coords, {}, 0, canviar_color);
	}
	
	/**
	 * raspbirra method for draw a heating element into a kettle and returns a raspbirra element Object for interactuate from front-end
	 * @param {rb_element} rb_element object (kettle) that have the coil inside
	 * @returns {rb_element} raspbirra element Object
	 */
	this.heating = function(rb_kettle)
	{
		var radi = 25;
		var x = rb_kettle.out.x-46;
		var y = rb_kettle.out.y-50-50;
		
		var icon = this.paper.circle(rb_kettle.out.x, rb_kettle.out.y-50, radi);
		icon.attr({"fill":rb_hmi_white});
		var linia = this.paper.path("M20,50L30,50L35,40L40,60L45,40L50,60L55,40L60,60L65,50L72,50")
		linia.translate(x, y);	
		
		var canviar_color = function(color){ icon.attr({"fill":color}); };
		
		return new rb_element("rb_heating_", 0, 0, new rb_coords(x,y), {}, {}, 0, canviar_color);
	}

	 /**
	 * raspbirra method for draw a kettle and returns a raspbirra element Object for interactuate from front-end
	 * @param {string} Coil ID
	 * @param {string} Coil name
	 * @returns {rb_element} raspbirra element Object
	 */
	this.kettle = function(id, name)
	{	
		// TODO: Permetre ubiicar la olla en una x,y determinada
		var x = this.rb_margin_initial_h + ((id)*(this.rb_kettle_width+this.rb_margin_h));
		var y = this.rb_margin_v;
		var kettle = this.paper.rect(x,
								 y,
								 this.rb_kettle_width,
								 this.rb_kettle_height,
								 this.rb_kettle_radi);
							  
		kettle.attr("fill", rb_hmi_grey);
		kettle.attr("stroke", rb_hmi_grey);
		
		var k_liquid = this.paper.rect(x+15,
									   y+150,
									   this.rb_kettle_width-15-15,
									   this.rb_kettle_height-15-150,
									   this.rb_kettle_radi);
							  
		k_liquid.attr("fill", rb_hmi_grey);
		k_liquid.attr("stroke", rb_hmi_grey);
		
		var i_buidar = this.paper.circle(x+25, y+25, 10);
		i_buidar.attr("fill", rb_hmi_white);
		i_buidar.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
		i_r_buidar = this.paper.path("M" + (x+25-15) + "," + (y+25+15) + "L" + (x+25+15) + "," + (y+25-15));
		
		var canviar_color = function(color){ 
			k_liquid.attr({"fill":color}); 
		};
		
		var kettle_txt = this.paper.text(x+(this.rb_kettle_width/2), this.rb_margin_v+30, name)
		kettle_txt.attr({ "font-size": 25});
		
		var rb_coords_out = new rb_coords(x+(this.rb_kettle_width/2)-(this.rb_thread_width/2), this.rb_margin_v+this.rb_kettle_height);
		
		var rb_coords_in = {};
		if (id == 0)
			rb_coords_in = new rb_coords(this.rb_margin_initial_h + ((id)*(this.rb_kettle_width+this.rb_margin_h))+this.rb_kettle_width-12, this.rb_margin_v+150+(this.rb_thread_width/2));
		else 
			rb_coords_in = new rb_coords(this.rb_margin_initial_h + ((id)*(this.rb_kettle_width+this.rb_margin_h))+12, this.rb_margin_v+150+(this.rb_thread_width/2));
		
		var rb_elem = new rb_element("rb_kettle_"+id, name, 0, new rb_coords(x,y), rb_coords_in, rb_coords_out, 0, canviar_color);
		
		i_buidar.click(function(event) {
			console.log("rb_kettle::buidar::" + rb_elem.id);
			rb_elem.set_color(rb_hmi_grey);	
			rb_elem.set_liquid(0, "rb_accio");
		});
		
		return rb_elem;
	}
	
	/**
	 * raspbirra method for draw a pump and returns a raspbirra element Object for interactuate from front-end
	 * @param {number} x position of the rb_element
	 * @param {number} y position of the rb_element
	 * @param {string} Pump ID
	 * @param {function} Callback function that will be called when user click over pump
	 * @returns {rb_element} raspbirra element Object
	 */
	this.pump = function(x, y, id, _click_function)
	{
		var radi = 30;
		var cercle = this.paper.circle(x, y+radi, radi);
		cercle.attr({"stroke-width": 3, fill: rb_hmi_red});
		
		var linia = this.paper.path("M5,12L30,60L55,12")
		linia.translate(x-radi, y);
		
		var text = this.paper.text(x-radi*1.5, y+radi, id);
		
		bomba = this.paper.set(cercle, text);
		bomba.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
		
		var rb_coords_in = new rb_coords(x,y);
		var rb_coords_out = new rb_coords(x,y+(radi*2));
		
		var canviar_color = function(color){ cercle.attr({"fill":color}); };
		var canviar_text = function(texte){ text.attr({"text":texte}); };
		
		var rb_elem = new rb_element("rb_pump_"+id, id, 0, new rb_coords(x,y), rb_coords_in, rb_coords_out, 0, canviar_color, canviar_text);
		
		bomba.click(function(event) {
			console.log("Bomba::" + rb_elem.stat);
			rb_elem.set_stat(Math.abs(rb_elem.stat-1));
			if (_click_function != undefined)
				_click_function();
		});
		
		return rb_elem;
	}
	
	/**
	 * raspbirra method for draw a thermometer inside a kettle and returns a raspbirra element Object for interactuate from front-end. 
	 * Have the option for draw a controller for indicate the objective temperature.
	 * @param {rb_element} rb_element object (kettle) that have the thermometer inside
	 * @param {string} Thermometer ID
	 * @param {bool} If True, will draw the objective temperature controller
	 * @param {function} Callback function that will be called when user click over controller
	 * @returns {rb_element} raspbirra element Object
	 */
	this.thermometer = function(rb_kettle, _id, has_controller, _click_function)
	{
		this.id = _id;
		
		var margin_height_elem = 65;
		var x = rb_kettle.out.x-(this.rb_temp_width/2);
		var y = this.rb_margin_v+margin_height_elem;
		
		var fons = this.paper.rect(x, y, this.rb_temp_width, this.rb_temp_height);
		fons.attr({"fill": rb_hmi_white});
		var txt = this.paper.text(rb_kettle.out.x, this.rb_margin_v+margin_height_elem+this.rb_temp_height/2, "17,678 ºC");
		txt.attr({ "font-size": 25});
		
		var txt_o = {};
		if (has_controller == 1)
		{
			var fons_o = this.paper.rect(rb_kettle.out.x-(this.rb_temp_width/2), this.rb_margin_v+margin_height_elem+this.rb_temp_height, this.rb_temp_width, 20);
			fons_o.attr({"fill": "#ffb907"});
			txt_o = this.paper.text(rb_kettle.out.x, this.rb_margin_v+margin_height_elem+this.rb_temp_height+20/2, "Consigna: 65ºC");
			txt_o.attr({ "font-size": 12});
			
			var configurador = this.paper.set(fons_o, txt_o);
			configurador.click(function(event) {
				alert("Modificar temp!");
				if (_click_function != undefined)
					_click_function();
			});
			
			configurador.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});		
		}
		var canviar_text = function(texte, es_consigna){ if (!es_consigna) icon.attr({"text":texte}); else txt_o.attr({ "text": 12});};
		
		return new rb_element("rb_therm_" + _id, _id, -1, new rb_coords(x,y), {},{}, 0, {}, canviar_text);
	}
	
	/**
	 * raspbirra method for draw a Tee. Permit connect 3 elements in same tee thread ALWAYS opened.
	 * @param {string} T ID
	 * @param {rb_element} First rb_element Object that will connect with T element
	 * @param {rb_element} Second rb_element Object that will connect with T element
	 * @param {rb_element} Third rb_element Object that will connect with T element
	 * @param {array} array of three numbers (1/0) that indicate if T will connect with the in or out of the specific rb_element
	 * @param {string} Middle points string (RaphaelJS format) for the middle points connections of the T. Permit draw lines with corners
	 * @param {int} up/down (1/0) for draw the three thread over/down the other elements
	 * @returns {rb_thread} raspbirra thread Object
	 */
	this.tee = function(id, rb_elem_1, rb_elem_2, rb_elem_3, arr_connections, middle_points, front) 
	{
		var thread_codi = "M" + (arr_connections[0]==0 ? rb_elem_1.in : rb_elem_1.out).get_rs_coord();
		thread_codi += String(middle_points) != "undefined" ? String(middle_points) : "";
		thread_codi += "L" + (arr_connections[1]==0 ? rb_elem_2.in : rb_elem_2.out).get_rs_coord();

		var thread = this.paper.path(thread_codi);
		thread.attr({"stroke-width": 5,"stroke":rb_hmi_darkgrey});
		if (front==undefined)
			thread.toBack();
		else
			thread.toFront();
		
		var thread_codi2 = "M" + (arr_connections[0]==0 ? rb_elem_1.in : rb_elem_1.out).get_rs_coord();
		thread_codi2 += String(middle_points) != "undefined" ? String(middle_points) : "";
		thread_codi2 += "L" + (arr_connections[2]==0 ? rb_elem_3.in : rb_elem_3.out).get_rs_coord();

		var thread2 = this.paper.path(thread_codi2);
		thread2.attr({"stroke-width": 5,"stroke":rb_hmi_darkgrey});
		if (front==undefined)
			thread2.toBack();
		else
			thread2.toFront();
		
		var canviar_color = function(color){ thread.attr({"stroke":color}); thread2.attr({"stroke":color}); };
		
		return new rb_thread("rb_tee_" + id, id, [rb_elem_1, rb_elem_2, rb_elem_3], arr_connections, canviar_color)
	}
	
	/**
	 * raspbirra method for draw a thread. Permit connect 2 elements in same thread ALWAYS opened.
	 * @param {string} thread ID
	 * @param {rb_element} First rb_element Object that will connect his out with thread
	 * @param {rb_element} Second rb_element Object that will connect his in with thread
	 * @param {string} Middle points string (RaphaelJS format) for the middle points connections of the T. Permit draw lines with corners
	 * @param {int} up/down (1/0) for draw the three thread over/down the other elements
	 * @returns {rb_thread} raspbirra thread Object
	 */
	this.thread = function(id, rb_elem_1, rb_elem_2, middle_points, front)
	{
		var thread_codi = "M" + rb_elem_1.out.get_rs_coord();
		thread_codi += String(middle_points) != "undefined" ? String(middle_points) : "";
		thread_codi += "L" + rb_elem_2.in.get_rs_coord();

		var thread = this.paper.path(thread_codi);
		thread.attr({"stroke-width": 5,"stroke":rb_hmi_darkgrey});
		if (front==undefined)
			thread.toBack();
		else
			thread.toFront();
		
		var canviar_color = function(color){ thread.attr({"stroke":color}); };
		
		return new rb_thread("rb_thread_" + id, id, [rb_elem_1, rb_elem_2], [1,0], canviar_color);
	}
	
	/**
	 * raspbirra method for draw a horizontal valve and returns a raspbirra element Object for interactuate from front-end. 
	 * This element permit open/close the liquid connections.
	 * This valve have the in on left side and out on right side of the element.
	 * @param {number} x position of the rb_element
	 * @param {number} y position of the rb_element
	 * @param {string} Valve ID
	 * @param {bool} If True, will turn the valve having in on right side and out on left side
	 * @param {bool} If True, will permit liquid flow for two directions of the element
	 * @param {function} Callback function that will be called when user click over valve
	 * @returns {rb_element} raspbirra element Object
	 */
	this.valve_h = function(x, y, id, inverse, bidirectional, _click_function)
	{
		var x_int = x-this.rb_valve_h_width;
		var y_int = y-(this.rb_valve_h_width/4);
		
		var v = this.paper.path("M0,0L25,12.5L50,0L50,25L25,12.5L0,25Z")
		v.translate(x_int, y_int);
		
		v.attr({"stroke-width": 3, fill: rb_hmi_red});
		
		var text = this.paper.text(x_int+(this.rb_valve_h_width/2), y_int+(this.rb_valve_h_width/2), id);
		
		var valve = this.paper.set(v, text);
		valve.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
		
		var rb_coords_in = new rb_coords(x_int,y);
		var rb_coords_out = new rb_coords(x_int+this.rb_valve_h_width, y);
		if (inverse==1)
		{
			var aux = rb_coords_out;
			rb_coords_out = rb_coords_in;
			rb_coords_in = aux;
		}
		var canviar_color = function(color){ v.attr({"fill":color}); };
		var canviar_text = function(texte){ text.attr({"text":texte}); };
		
		var rb_elem = new rb_element("rb_valv_"+id, id, 0, new rb_coords(x,y), rb_coords_in, rb_coords_out, bidirectional, canviar_color, canviar_text);
		
		valve.click(function(event) {
			console.log("Valvula_h::" + rb_elem.stat);
			rb_elem.set_stat(Math.abs(rb_elem.stat-1));
			if (_click_function != undefined)
				_click_function();
		});
		
		return rb_elem;
	}

	/**
	 * raspbirra method for draw a vertical valve and returns a raspbirra element Object for interactuate from front-end. 
	 * This element permit open/close the liquid connections.
	 * This valve have the in on up side and out on down side of the element.
	 * @param {number} x position of the rb_element
	 * @param {number} y position of the rb_element
	 * @param {string} Valve ID
	 * @param {bool} If True, will permit liquid flow for two directions of the element
	 * @param {function} Callback function that will be called when user click over valve
	 * @returns {rb_element} raspbirra element Object
	 */
	this.valve_v = function(x, y, id, bidirectional, _click_function)
	{
		x = x-(this.rb_valve_v_width/2);
		var v = this.paper.path("M0,0L25,0L12.5,25L25,50L0,50L12.5,25Z")
		v.translate(x, y);
		
		v.attr({"stroke-width": 3, fill: rb_hmi_red});
		
		var rb_text = this.paper.text(x-this.rb_valve_v_width/2, y+this.rb_valve_v_height/2, id);
		
		var valve = this.paper.set(v, rb_text);
		
		valve.hover(function(){ this.scale(1.1);this.attr({"cursor": "pointer"});},function(){ this.scale(1/1.1);this.attr({"cursor": "default"});});
			
		var rb_coords_in = new rb_coords(x+(this.rb_valve_v_width/2), y);
		var rb_coords_out = new rb_coords(x+(this.rb_valve_v_width/2), y+this.rb_valve_v_height);
		
		var canviar_color = function(color){
			v.attr({fill: color});
		}
		
		var canviar_text = function(text){
			rb_text.attr({"text": text});
		}
		
		var rb_elem = new rb_element("rb_valv_"+id, id, 0, new rb_coords(x,y), rb_coords_in, rb_coords_out, bidirectional, canviar_color, canviar_text);
		
		valve.click(function(event) {
			// Canviar d'estat l'element i avisar la out (i si bi tb l'in) del canvi d'estat
			console.log("Valvula_v" + rb_elem.id +"_" + rb_elem.name+"::" + rb_elem.stat);
			
			rb_elem.set_stat(Math.abs(rb_elem.stat-1));
						
			if (_click_function != undefined)
				_click_function();
		});
		
		return rb_elem;
	}
	
	/* Mètodes privats */
	/**
	 * Generic raspbirra element Object (rb_element) for interactuate with kettles, coils, valves,...
	 * @param {string} Id del element
	 * @param {string} Nom del element
	 * @param {rb_coords} Coordenades a on s'ha de dibuixar l'element
	 * @param {rb_coords} Indica el la posició x,y del vèrtex d'in
	 * @param {rb_coords} Indica el la posició x,y del vèrtex de out
	 * @param {bool} Indica si l'element es pot clicar, per tant al passar per sobre s'escalen els elements i es canvia el punter 
	 * @param {bool} Indica si l'element permet circular líquid en els dos sentits 
	 */
	function rb_element(_id, _nom, _estat, _coords, _coords_in, _coords_out, _bidirectional, _ch_color_function, _ch_text_function)
	{
		this.id = _id,
		this.name = _nom;
		this.coords = _coords;
		this.in = _coords_in;
		this.out = _coords_out;
		this.thread_in = {};  // Element Raspbirra connectat a l'in. Serveix per poder controlar l'aigües amunt.
		this.thread_out = {};  // Element Raspbirra connectat a la out. Serveix per poder controlar l'aigües avall.
		this.bidirectional = _bidirectional
		
		this.liquid = 0;
		this.stat = _estat; // Estat del objecte (encès/parat). Si no té estat o és indeterminat queda a -1.
		
		/**
		 * Method for know the liquid stat of the both threads of the element (in/out)
		 * @returns {array} array of the threads that have liquid
		 */
		this.get_liquid_threads = function()
		{
			var arr_liquid_threads = [];
			if (this.thread_in.liquid == 1)
				arr_liquid_threads.push(this.thread_in);
			if (this.thread_out.liquid == 1)
				arr_liquid_threads.push(this.thread_out);
			return arr_liquid_threads;
		}
		/**
		 * Method for assign the in thread of the element
		 * @param {rb_thread} thread Object that will be assigned to in of rb_element
		 */
		this.set_thread_in = function(rb_thread)
		{
			this.thread_in = rb_thread;
		}
		/**
		 * Method for assign the out thread of the element
		 * @param {rb_thread} thread Object that will be assigned to out of rb_element
		 */
		this.set_thread_out = function(rb_thread)
		{
			this.thread_out = rb_thread;
		}
		/**
		 * Method for assign the color of the element
		 * @param {string} color in html format (Ex: "red", "#000000", "#000", ...)
		 */
		this.set_color = function(color)
		{
			_ch_color_function(color);
		}
		/**
		 * Method for assign the message text of the element
		 * @param {string} contains the message text to show
		 */
		this.set_text = function(text) {
			_ch_text_function(text);
		};
		/**
		 * Method for assign the new liquid stat of the element
		 * @param {number} with the new liquid stat (0- empty, 1- water, 2- worst)
		 * @param {string} id of the element that assign the new liquid stat
		 */
		this.set_liquid = function(new_stat, id_origen)
		{			
			if (new_stat == this.liquid)
				return;
			
			console.log("rb_element::"+this.id+"::set_liquid::"+new_stat+"::Origen::"+id_origen);
			if (this.id.substring(0, 7)=="rb_pump" || this.id.substring(0, 7)=="rb_valv"){
				if (this.stat == 0) 
					return;
			} 
			else if (this.id=="rb_kettle_0")
			{
				if (new_stat != 0)
				{
					this.liquid = new_stat;
					this.set_color(rb_hmi_liquid);				
				}
				else 
				{
					if (id_origen == 'rb_accio')
					{
						this.set_color(rb_hmi_grey);
						this.liquid = 0;
					}
					return;
				}
			}
			else if (this.id.substring(0, 9)=="rb_kettle" || this.id.substring(0, 13)=="rb_fermenter")
			{
				if (new_stat != 0)
				{
					this.liquid=2;
					new_stat=2;
					this.set_color(rb_hmi_wort);
				}
				else 
				{
					if (id_origen == 'rb_accio')
					{
						this.set_color(rb_hmi_grey);
						this.liquid = 0;
					}
					return;
				}
			}
			else
			{
				this.liquid = new_stat;
			}
			
			if (id_origen == "rb_accio")
				return;
			
			if (this.thread_out.hasOwnProperty('id') && this.thread_out.id != id_origen)
				this.thread_out.set_liquid(new_stat, this.id);
			
			if (this.bidirectional==1 && this.thread_in.hasOwnProperty('id') && this.thread_in.id != id_origen)
				this.thread_in.set_liquid(new_stat, this.id);
		}
		/**
		 * Method for assign the new stat (open/close) of the element
		 * @param {number} with the new liquid stat (0- close, 1- open)
		 * @param {string} id of the element that assign the new liquid stat
		 */
		this.set_stat = function(new_stat, id_origen)
		{
			console.log("rb_element::"+this.id+"::set_stat::"+new_stat);
			this.stat = new_stat;
			
			if (this.stat == 0)
				this.set_color(rb_hmi_red);
			else if (this.stat == 1)
				this.set_color(rb_hmi_green);
			else 
				this.set_color(rb_hmi_white);
			
			if (id_origen == "rb_accio")
				return;
			
			if (this.bidirectional==1)
			{
				// ULL!!! Les bidireccionals no s'han de limitar la out al tancar!
				if(this.thread_out.hasOwnProperty('id') && this.thread_in.hasOwnProperty('id'))
				{
					if (new_stat==0)
					{
						console.log("rb_elem::set_stat::new_stat==0");
						// Obtenir els elements de les dues sortides i treure el líquid de la no necessaria
						var arr_elem_liquid = this.thread_out.get_liquid_elements();
						var trobat = false;
						for (var i=0;i<arr_elem_liquid.length;i++)
						{
							if (arr_elem_liquid[i].id != this.id && arr_elem_liquid[i].id.substr(0, 9)!='rb_kettle')
							{
								var arr_threads = arr_elem_liquid[i].get_liquid_threads();
								for (var j=0;j<arr_threads.length;j++)
								{
									if (arr_threads[j].id != this.thread_out.id)
									{
										trobat = true;
										break;
									}
								}
							}
						}
						if (!trobat)
							this.thread_out.set_liquid(0);
						
						var arr_elem_liquid = this.thread_in.get_liquid_elements();
						var trobat = false;
						for (var i=0;i<arr_elem_liquid.length;i++)
						{
							if (arr_elem_liquid[i].id != this.id && arr_elem_liquid[i].id.substr(0, 9)!='rb_kettle')
							{
								var arr_threads = arr_elem_liquid[i].get_liquid_threads();
								for (var j=0;j<arr_threads.length;j++)
								{
									if (arr_threads[j].id != this.thread_in.id)
									{
										trobat = true;
										break;
									}
								}
							}
						}
						if (!trobat)
							this.thread_in.set_liquid(0);
						
					}
					else
					{
						// Possibilitats quan s'obre la vàlvula
						// 1 - Líquid als dos costats -> Vàlvula liquid=1 no fer res
						// 2 - Líquid a cap dels costats -> Vàlvula liquid=0 no fer res
						console.log("rb_element::"+this.id+"::Entrada i out assignades::" +this.thread_in.id+"::"+this.thread_out.id);
						if (this.thread_in.liquid==this.thread_out.liquid)
							this.liquid=this.thread_in.liquid;
						else {
							if (this.thread_in.liquid==1) // 3 - Líquid a l'in -> Líquid a 1 i out liquid a 1
								this.thread_out.set_liquid(this.thread_in.liquid, this.id);	
							else 
								// 4 - Líquid a la out -> Líquid a 1 i in liquid a 1
								this.thread_in.set_liquid(this.thread_out.liquid, this.id);	
						}						
					}
				}
			}
			else
			{
				if(this.thread_out.hasOwnProperty('id') && this.thread_in.hasOwnProperty('id'))
				{
					if (new_stat==0)
						this.thread_out.set_liquid(0);
					else
					{
						this.thread_out.set_liquid(this.thread_in.liquid);
					}
				}
			}
		}
	}
	
	/**
	 * Generic raspbirra element Object (rb_thread) for interactuate with the threads and tee
	 * @param {string} Thread Id
	 * @param {string} Thread Name
	 * @param {array} Array of the rb_elements that will connect with this trhead
	 * @param {array} Array that indicate if the element of this position will connect with in (0) or out (1)
	 * @param {function} Function that will be called for change the color of the element
	 */
	function rb_thread(_id, _nom, _arr_elements, _arr_connexions, _ch_color_function)
	{
		var funcio_color = _ch_color_function;
		var arr_elements = _arr_elements;
		var arr_connexions = _arr_connexions;
		
		this.id = _id;
		this.name = _nom;
		this.liquid = 0;
		this.stat = -1; // Estat del objecte (encès/parat). Si no té estat o és indeterminat queda a -1.
		
		for (i =0;i < arr_elements.length;i++)
		{
			if (arr_connexions[i]==0)
				arr_elements[i].set_thread_in(this);
			else 
				arr_elements[i].set_thread_out(this);
		}
		
		/**
		 * Method for know the liquid stat of the element connected with this thread
		 * @returns {array} array of the elements (rb_element) that have liquid
		 */
		this.get_liquid_elements = function()
		{
			var arr_elem_liquid = [];
			for (var i=0;i<arr_elements.length;i++)
			{
				if (arr_elements[i].liquid==1)
					arr_elem_liquid.push(arr_elements[i]);
			}
			return arr_elem_liquid;
		}
		/**
		 * Method for assign the color of the thread
		 * @param {string} color in html format (Ex: "red", "#000000", "#000", ...)
		 */
		this.set_color = function(color)
		{
			funcio_color(color);
		}
		/**
		 * Method for assign the new liquid stat of the element
		 * @param {number} with the new liquid stat (0- empty, 1- water, 2- worst)
		 * @param {string} id of the element that assign the new liquid stat
		 */
		this.set_liquid = function(new_stat, id_origen)
		{
			console.log("rb_thread::"+this.id+"::set_liquid::"+new_stat+"::Origen::"+ id_origen);
			this.liquid = new_stat;
			if (this.liquid==1)
				this.set_color(rb_hmi_liquid);
			else if (this.liquid==2)
				this.set_color(rb_hmi_wort);
			else
				this.set_color(rb_hmi_darkgrey);
			
			if (id_origen == "rb_accio")
				return;
			
			for (i =0;i<arr_elements.length;i++){
				if (arr_elements[i].id!=id_origen){
					console.log("rb_thread::" + this.id+"::set_liquid::Origen::" + id_origen + "::element_cridat_set_liquid::" +arr_elements[i].id)
					arr_elements[i].set_liquid(new_stat, this.id);
				}
				
			}
		}
	}
		
	/**
	 * Coords object
	 * @param {float} X coord
	 * @param {float} Y coord
	 */
	function rb_coords(_x, _y)
	{
		this.x = _x;
		this.y = _y;
		
		/**
		 * Returns the coords in RaphaelJS format (comma separated. Ex: 12.3,5)
		 * @returns {string} the coords in RaphaelJS format (comma separated. Ex: 12.3,5)
		 */
		this.get_rs_coord = function() { return String(this.x) + "," + String(this.y);};
	}
}
