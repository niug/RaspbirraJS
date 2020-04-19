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

var olles = [];
var valvules = [];
var bombes = [];
var tubs = [];

var s1 = {};
var i1 = {};
var i2 = {};
var r1 = {};
var f1 = {};

function rb_liquid_inicial()
{
	for (var tub_id in tubs)
	{
		tubs[tub_id].set_liquid(0, 'rb_accio');
	}
	for (var valvula_id in valvules)
	{
		valvules[valvula_id].set_liquid(0, 'rb_accio');
	}
	for (var bomba_id in bombes)
	{
		bombes[bomba_id].set_liquid(0, 'rb_accio');
	}
	for (var olla_id in olles)
	{
		olles[olla_id].set_liquid(0, 'rb_accio');
	}
}

function rb_stat_inicial()
{
	for (var valvula_id in valvules)
	{
		valvules[valvula_id].set_stat(0, 'rb_accio');
	}
	for (var bomba_id in bombes)
	{
		bombes[bomba_id].set_stat(0, 'rb_accio');
	}
}

function rb_configurar_elements(rb_pas)
{
	// Si bullint, buidem les olles de HLT i Macerat
	if (rb_pas == 6)
	{
		olles[0].set_liquid(0, 'rb_accio');
		olles[1].set_liquid(0, 'rb_accio');
	}
	if (rb_pas == 8)
		olles[2].set_liquid(0, 'rb_accio');
	
	for(var id_elem in json_config[rb_pas].valvules) {
	   valvules[id_elem].set_stat(json_config[rb_pas].valvules[id_elem]);
	}
	for(var id_elem in json_config[rb_pas].bombes) {
	   bombes[id_elem].set_stat(json_config[rb_pas].bombes[id_elem]);
	}
}

function rb_espurna_de_vilopriu(rb)
{	
	f1 = rb.fermenter();
	
	olles[0] = rb.kettle(0, 'HLT');	
	olles[1] = rb.kettle(1, 'Macerat');
	olles[2] = rb.kettle(2, 'Bullit');

	s1 = rb.coil(olles[0], "S1");
	i1 = rb.thermometer(olles[0], "I1", 1);
	i2 = rb.thermometer(olles[1], "I2");
	r1 = rb.heating(olles[0]);

	bombes[0] = rb.pump(olles[0].out.x, olles[0].out.y+90,"B0");

	valvules[0] = rb.valve_v(olles[0].out.x, olles[0].out.y+18, "V0");

	tubs[0] = rb.thread("T0", olles[0], valvules[0]);
	tubs[1] = rb.thread("T1", valvules[0], bombes[0]);

	valvules[1] = rb.valve_v(olles[0].out.x, olles[0].out.y+180, "V1");
	valvules[2] = rb.valve_h(olles[0].out.x+68, olles[0].out.y+163, "V2");

	tubs[2] = rb.tee("T2", bombes[0], valvules[1], valvules[2], [1, 0, 0], "L"+bombes[0].out.x+","+valvules[2].in.y);

	valvules[3] = rb.valve_h(olles[0].out.x+68, olles[0].out.y+162+86, "V3", 1);

	valvules[4] = rb.valve_h((s1.in.x)-100, s1.in.y, "V4");
	tubs[3] = rb.thread("T3", valvules[4], s1, "", 1);

	var pi1 = "L"+bombes[0].out.x+","+(valvules[1].out.y+18);
	var pi2 = "L"+(valvules[4].in.x-18)+","+(valvules[1].out.y+21);
	var pi3 = "L"+(valvules[4].in.x-18)+","+(valvules[4].out.y);

	tubs[4] = rb.tee("T4", valvules[4], valvules[1], valvules[3], [0, 1, 1], pi3+pi2+pi1, 0, 1);

	valvules[5] = rb.valve_h(olles[0].in.x+71, olles[0].in.y, "V5", 1);
	tubs[5] = rb.thread("T5", valvules[5], olles[0], "", 1);

	valvules[6] = rb.valve_h(olles[0].in.x+162, olles[0].in.y, "V6", 0, 1);
	var pi4 = "L"+(valvules[5].in.x+18)+","+valvules[2].out.y;
	var pi5 = "L"+(valvules[5].in.x+18)+","+valvules[5].in.y;

	tubs[6] = rb.tee("T6", valvules[2], valvules[5], valvules[6], [1, 0, 0], pi4+pi5);

	valvules[7] = rb.valve_h(olles[1].in.x-18, olles[1].in.y, "V7");

	valvules[8] = rb.valve_v(valvules[7].in.x-21, valvules[7].in.y-75, "V8");
	var pi6 = "L" + valvules[8].out.x + "," + valvules[7].in.y;

	tubs[7] = rb.tee("T7", valvules[8], valvules[6], valvules[7], [1, 1, 0], pi6);

	var pi7 = "L" + (valvules[4].in.x-18) + "," + s1.out.y;
	var pi8 = "L" + (valvules[4].in.x-18) + "," + 35;
	var pi9 = "L" + valvules[8].out.x+ "," + 35;
	tubs[8] = rb.thread("T8", s1, valvules[8], pi7+pi8+pi9, 1);

	valvules[9] = rb.valve_v(olles[1].out.x, olles[1].out.y+18, "V9");
	tubs[9] = rb.thread("T9", olles[1], valvules[9]);
	bombes[1] = rb.pump( olles[1].out.x, olles[1].out.y+90,"B1");
	tubs[10] = rb.thread("T10", valvules[9], bombes[1]);

	valvules[10] = rb.valve_v(olles[2].out.x, olles[2].out.y+18, "V10");
	tubs[11] = rb.thread("T11", olles[2], valvules[10]);
	bombes[2] = rb.pump( olles[2].out.x, olles[2].out.y+90,"B2");
	tubs[12] = rb.thread("T12", valvules[10], bombes[2]);

	valvules[11] = rb.valve_h(bombes[1].out.x-18, valvules[3].out.y, "V11");
	valvules[12] = rb.valve_h(bombes[1].out.x+18+50, valvules[3].out.y, "V12");

	var pi10 = "L" + bombes[1].out.x+","+valvules[11].out.y;

	tubs[13] = rb.tee("T13", bombes[1], valvules[11], valvules[12], [1, 0, 0], pi10);

	tubs[14] = rb.thread("T14", valvules[11], valvules[3]);
	var pi11 = "L"+(valvules[12].out.x+170)+","+valvules[12].out.y;
	var pi12 = "L"+(valvules[12].out.x+170)+","+olles[2].in.y;
	tubs[15] = rb.thread("T15", valvules[12], olles[2], pi11+pi12, 1);
	tubs[16] = rb.thread("T16", valvules[7], olles[1], "", 1);	
	tubs[17] = rb.thread("T17", bombes[2], f1, "", 1);	
	
	// Emplenem el HLT
	olles[0].set_liquid(1)
}