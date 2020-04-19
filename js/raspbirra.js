/*
MIT License

Copyright (c) 2020 Niug - Espurna de Vilopriu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Colors elements raspbirra
rb_hmi_white = "#fff";
rb_hmi_red = "#edb1b1";
rb_hmi_green = "#e1edb1";
rb_hmi_grey = "#d3d3d3";
rb_hmi_darkgrey = "#A2A0A1";
rb_hmi_liquid = "#39b1ef";
rb_hmi_wort = "#edaa44";

/**
 * Frontend library for developing the visual interface of the raspbirra system, using canvas library RaphaelJS.
 * @param {string} div_id Html id from the element that will have the canvas
 * @param {number} width Canvas width 
 * @param {number} height Canvas height
 * @returns {raspbirra} Frontend object for drawing and handle the raspbirra human machine interface (HMI)
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
	 * Raspbirra method for drawing a coil inside a kettle and returns a raspbirra element object
	 * @param {rb_element} rb_kettle Kettle object that contains the coil inside
	 * @param {string} id Coil ID
	 * @returns {rb_element} Raspbirra element object
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
	 * Raspbirra method for drawing a fermenter on canvas and returns a raspbirra element object
	 * @returns {rb_element} Raspbirra element Object
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
	 * Raspbirra method for drawing a heating element inside a kettle and returns a raspbirra element object
	 * @param {rb_element} rb_kettle rb_element object (kettle) that contains the coil inside
	 * @returns {rb_element} Raspbirra element object
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
	 * Raspbirra method for drawing a kettle and returns a raspbirra element object
	 * @param {string} id Coil ID
	 * @param {string} name Coil name
	 * @returns {rb_element} Raspbirra element object
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
	 * Raspbirra method for drawing a pump and returns a raspbirra element object
	 * @param {number} x Position of the rb_element
	 * @param {number} y Position of the rb_element
	 * @param {string} id Pump ID
	 * @param {function} _click_function Callback function that will be called when user click over pump
	 * @returns {rb_element} Raspbirra element object
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
			console.log("Bomba::" + rb_elem.state);
			rb_elem.set_state(Math.abs(rb_elem.state-1));
			if (_click_function != undefined)
				_click_function();
		});
		
		return rb_elem;
	}
	
	/**
	 * Raspbirra method for drawing a thermometer inside a kettle and returns a raspbirra element object.
	 * There is the option for drawing a controller to indicate the objective temperature.
	 * @param {rb_element} rb_kettle rb_element object (kettle) that contains the thermometer inside
	 * @param {string} _id Thermometer ID
	 * @param {bool} has_controller If True, will draw the objective temperature controller
	 * @param {function} _click_function Callback function that will be called when user click over controller
	 * @returns {rb_element} Raspbirra element object
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
	 * Raspbirra method for drawing a Tee thread that connects 3 elements in the same Tee thread, ALWAYS opened
	 * @param {string} id Tee thread ID
	 * @param {rb_element} rb_elem_1 First rb_element object that will connect with Tee thread element
	 * @param {rb_element} rb_elem_2 Second rb_element object that will connect with Tee thread element
	 * @param {rb_element} rb_elem_3 Third rb_element object that will connect with Tee thread element
	 * @param {array} arr_connections Array of three numbers (1/0) that indicates if Tee thread will connect with the in (0) or out (1) of the specific rb_element
	 * @param {string} middle_points Middle points string (RaphaelJS format) for the middle points connections of the Tee thread. Permit drawing lines with corners
	 * @param {number} front Up/down (1/0) for drawing threads over/down the other elements
	 * @returns {rb_thread} raspbirra thread object
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
	 * Raspbirra method for drawing a thread. Connect 2 elements in same thread ALWAYS opened.
	 * @param {string} id Thread ID
	 * @param {rb_element} rb_elem_1 First rb_element object that will connect his 'out' with thread
	 * @param {rb_element} rb_elem_2 Second rb_element Object that will connect his 'in' with thread
	 * @param {string} middle_points Middle points string (RaphaelJS format) for the middle points connections of the thread. Permit drawing lines with corners
	 * @param {number} front Up/down (1/0) for drawing threads over/down the other elements
	 * @returns {rb_thread} raspbirra thread object
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
	 * Raspbirra method for drawing a horizontal valve and returns a raspbirra element object
	 * This element handles open/close the liquid connections.
	 * This valve has the 'in' on left side and 'out' on right side of the element.
	 * @param {number} x X position of the rb_element
	 * @param {number} y Y position of the rb_element
	 * @param {string} id Valve ID
	 * @param {bool} inverse If True, will rotate the valve 180º with the 'in' on the right side and 'out' on the left side
	 * @param {bool} bidirectional If True, permit liquid to flow in both directions of the element
	 * @param {function} _click_function Callback function that will be called when user click over valve
	 * @returns {rb_element} Raspbirra element object
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
			console.log("Valvula_h::" + rb_elem.state);
			rb_elem.set_state(Math.abs(rb_elem.state-1));
			if (_click_function != undefined)
				_click_function();
		});
		
		return rb_elem;
	}

	/**
	 * Raspbirra method for drawing a vertical valve and returns a raspbirra element object
	 * This element handles open/close the liquid connections.
	 * This valve has 'in' on the up side and 'out' on the down side of the element.
	 * @param {number} x X position of the rb_element
	 * @param {number} y Y position of the rb_element
	 * @param {string} id Valve ID
	 * @param {bool} bidirectional If True, permit liquid to flow in both directions of the element
	 * @param {function} _click_function Callback function that will be called when user click over valve
	 * @returns {rb_element} Raspbirra element object
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
			console.log("Valvula_v" + rb_elem.id +"_" + rb_elem.name+"::" + rb_elem.state);
			
			rb_elem.set_state(Math.abs(rb_elem.state-1));
						
			if (_click_function != undefined)
				_click_function();
		});
		
		return rb_elem;
	}
	
	/* Mètodes privats */
	/**
	 * Generic raspbirra element Object (rb_element) for interactuating with kettles, coils, valves, pumps,...
	 * @param {string} _id rb_element ID
	 * @param {string} _name rb_element name
	 * @param {number} _state Element state (0- Close / 1- Open)
	 * @param {rb_coords} _coords Coords of the rb_element
	 * @param {rb_coords} _coords_in Coords of the thread 'in' of the rb_element
	 * @param {rb_coords} _coords_out Coords of the thread 'out' of the rb_element
	 * @param {bool} bidirectional If True, permit liquid to flow in both directions of the element
	 * @param {function} _ch_color_function Callback function that will be called for change the color of the rb_element
	 * @param {function} _ch_text_function Callback function that will be called for change the text of the rb_element
	 */
	function rb_element(_id, _name, _state, _coords, _coords_in, _coords_out, _bidirectional, _ch_color_function, _ch_text_function)
	{
		this.id = _id,
		this.name = _name;
		this.coords = _coords;
		this.in = _coords_in;
		this.out = _coords_out;
		this.thread_in = {};  // Element Raspbirra connectat a l'in. Serveix per poder controlar l'aigües amunt.
		this.thread_out = {};  // Element Raspbirra connectat a la out. Serveix per poder controlar l'aigües avall.
		this.bidirectional = _bidirectional
		
		this.liquid = 0;
		this.state = _state; // Estat del objecte (encès/parat). Si no té estat o és indeterminat queda a -1.
		
		/**
		 * Method for knowing the liquid state of the both threads of the element (in/out)
		 * @returns {array} Array of threads that contains liquid
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
		 * Method that assigns the 'in' thread of the element
		 * @param {rb_thread} rb_thread Thread object that will be assigned to 'in' of rb_element
		 */
		this.set_thread_in = function(rb_thread)
		{
			this.thread_in = rb_thread;
		}
		/**
		 * Method that assigns the 'out' thread of the element
		 * @param {rb_thread} rb_thread thread Object that will be assigned to 'out' of rb_element
		 */
		this.set_thread_out = function(rb_thread)
		{
			this.thread_out = rb_thread;
		}
		/**
		 * Method that assigns the color of the element
		 * @param {string} color Color in html format (Ex: "red", "#000000", "#000", ...)
		 */
		this.set_color = function(color)
		{
			_ch_color_function(color);
		}
		/**
		 * Method that assigns the message text of the element
		 * @param {string} text Contains the message text to show
		 */
		this.set_text = function(text) {
			_ch_text_function(text);
		};
		/**
		 * Method that assigns the new liquid state of the element
		 * @param {number} new_state Value of the new liquid state (0- empty, 1- water, 2- worst)
		 * @param {string} id_origen Id of the element that assigns the new liquid state
		 */
		this.set_liquid = function(new_state, id_origen)
		{			
			if (new_state == this.liquid)
				return;
			
			console.log("rb_element::"+this.id+"::set_liquid::"+new_state+"::Origen::"+id_origen);
			if (this.id.substring(0, 7)=="rb_pump" || this.id.substring(0, 7)=="rb_valv"){
				if (this.state == 0) 
					return;
			} 
			else if (this.id=="rb_kettle_0")
			{
				if (new_state != 0)
				{
					this.liquid = new_state;
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
				if (new_state != 0)
				{
					this.liquid=2;
					new_state=2;
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
				this.liquid = new_state;
			}
			
			if (id_origen == "rb_accio")
				return;
			
			if (this.thread_out.hasOwnProperty('id') && this.thread_out.id != id_origen)
				this.thread_out.set_liquid(new_state, this.id);
			
			if (this.bidirectional==1 && this.thread_in.hasOwnProperty('id') && this.thread_in.id != id_origen)
				this.thread_in.set_liquid(new_state, this.id);
		}
		/**
		 * Method that assigns the new state (open/close) of the element
		 * @param {number} new_state Value of the new element state (0- close, 1- open)
		 * @param {string} id_origen Id of the element that assigns the new liquid state
		 */
		this.set_state = function(new_state, id_origen)
		{
			console.log("rb_element::"+this.id+"::set_state::"+new_state);
			this.state = new_state;
			
			if (this.state == 0)
				this.set_color(rb_hmi_red);
			else if (this.state == 1)
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
					if (new_state==0)
					{
						console.log("rb_elem::set_state::new_state==0");
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
					if (new_state==0)
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
	 * Generic raspbirra element object (rb_thread) that handles the threads and tees
	 * @param {string} _id Thread Id
	 * @param {string} _name Thread Name
	 * @param {array} _arr_elements Array of the rb_elements that will connect with this thread
	 * @param {array} _arr_connexions Array that indicates if the element of this position will connect with in (0) or out (1)
	 * @param {function} _ch_color_function Function that will be called for change the color of the element
	 */
	function rb_thread(_id, _name, _arr_elements, _arr_connexions, _ch_color_function)
	{
		var funcio_color = _ch_color_function;
		var arr_elements = _arr_elements;
		var arr_connexions = _arr_connexions;
		
		this.id = _id;
		this.name = _name;
		this.liquid = 0;
		this.state = -1; // Estat del objecte (encès/parat). Si no té estat o és indeterminat queda a -1.
		
		for (i =0;i < arr_elements.length;i++)
		{
			if (arr_connexions[i]==0)
				arr_elements[i].set_thread_in(this);
			else 
				arr_elements[i].set_thread_out(this);
		}
		
		/**
		 * Method for knowledge the liquid state of the element connected with this thread
		 * @returns {array} Array of the elements (rb_element) that contains liquid
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
		 * Method that assigns the color of the thread
		 * @param {string} color Color in html format (Ex: "red", "#000000", "#000", ...)
		 */
		this.set_color = function(color)
		{
			funcio_color(color);
		}
		/**
		 * Method that assigns the new liquid state of the element
		 * @param {number} new_state Value of the new liquid state (0- empty, 1- water, 2- worst)
		 * @param {string} id_origen Id of the element that assigns the new liquid stat
		 */
		this.set_liquid = function(new_state, id_origen)
		{
			console.log("rb_thread::"+this.id+"::set_liquid::"+new_state+"::Origen::"+ id_origen);
			this.liquid = new_state;
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
					arr_elements[i].set_liquid(new_state, this.id);
				}
				
			}
		}
	}
		
	/**
	 * Coords object (x,y)
	 * @param {number} _x X coord
	 * @param {number} _y Y coord
	 */
	function rb_coords(_x, _y)
	{
		this.x = _x;
		this.y = _y;
		
		/**
		 * Returns the coords in RaphaelJS format (comma separated. Ex: "12.3,5")
		 * @returns {string} the coords in RaphaelJS format (comma separated. Ex: "12.3,5")
		 */
		this.get_rs_coord = function() { return String(this.x) + "," + String(this.y);};
	}
}
