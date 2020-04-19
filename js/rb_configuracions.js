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

var json_config = [];

// 0 - Inicial
json_config[0] = {
						nom: "Inici",
						valvules: {
							0: 0,
							1: 0,
							2: 0,
							3: 0,
							4: 0,
							5: 0,
							6: 0,
							7: 0,
							8: 0,
							9: 0,
							10: 0,
							11: 0,
							12: 0,
						},
						bombes: {
							0: 0,
							1: 0,
							2: 0,
						}
					};

// 1 - Escalfar HLT
json_config[1] = {
						nom: "Escalfar HLT",
						valvules: {
							0: 1,
							1: 0,
							2: 1,
							3: 0,
							4: 0,
							5: 1,
							6: 0,
							7: 0,
							8: 0,
							9: 0,
							10: 0,
							11: 0,
							12: 0,
						},
						bombes: {
							0: 1,
							1: 0,
							2: 0,
						}
					};
					
// 2 - Emplenar Macerat
json_config[2] = {
						nom: "Emplenar Macerat",
						valvules: {
							0: 1,
							1: 0,
							2: 1,
							3: 0,
							4: 0,
							5: 0,
							6: 1,
							7: 1,
							8: 0,
							9: 0,
							10: 0,
							11: 0,
							12: 0,
						},
						bombes: {
							0: 1,
							1: 0,
							2: 0,
						}
					};
										
// 3 - Macerar
json_config[3] = {
						nom: "Macerar",
						valvules: {
							0: 1,
							1: 0,
							2: 1,
							3: 1,
							4: 1,
							5: 1,
							6: 0,
							7: 1,
							8: 1,
							9: 1,
							10: 0,
							11: 1,
							12: 0,
						},
						bombes: {
							0: 1,
							1: 1,
							2: 0,
						}
					};
															
// 4 - Traspassar a Bullit
json_config[4] = {
						nom: "Traspassar al Bullit",
						valvules: {
							0: 0,
							1: 0,
							2: 0,
							3: 0,
							4: 0,
							5: 0,
							6: 0,
							7: 0,
							8: 0,
							9: 1,
							10: 0,
							11: 0,
							12: 1,
						},
						bombes: {
							0: 0,
							1: 1,
							2: 0,
						}
					};
															
// 5 - Rentat
json_config[5] = {
						nom: "Rentat",
						valvules: {
							0: 1,
							1: 1,
							2: 0,
							3: 0,
							4: 1,
							5: 0,
							6: 0,
							7: 1,
							8: 1,
							9: 1,
							10: 0,
							11: 0,
							12: 1,
						},
						bombes: {
							0: 1,
							1: 1,
							2: 0,
						}
					};
															
// 6 - Bullint
json_config[6] = {
						nom: "Bullint",
						valvules: {
							0: 0,
							1: 0,
							2: 0,
							3: 0,
							4: 0,
							5: 0,
							6: 0,
							7: 0,
							8: 0,
							9: 0,
							10: 0,
							11: 0,
							12: 0,
						},
						bombes: {
							0: 0,
							1: 0,
							2: 0,
						}
					};
																				
// 7 - Traspassar al fermentador
json_config[7] = {
						nom: "Traspassar al fermentador",
						valvules: {
							0: 0,
							1: 0,
							2: 0,
							3: 0,
							4: 0,
							5: 0,
							6: 0,
							7: 0,
							8: 0,
							9: 0,
							10: 1,
							11: 0,
							12: 0,
						},
						bombes: {
							0: 0,
							1: 0,
							2: 1,
						}
					};
																				
// 8 - Fermentar
json_config[8] = {
						nom: "Fermentar",
						valvules: {
							0: 0,
							1: 0,
							2: 0,
							3: 0,
							4: 0,
							5: 0,
							6: 0,
							7: 0,
							8: 0,
							9: 0,
							10: 0,
							11: 0,
							12: 0,
						},
						bombes: {
							0: 0,
							1: 0,
							2: 0,
						}
					};