// Hacked together aimlessly by Kai Hilton-Jones
// Improved by Tim Payne
// Improved by Vojta Plzak 3.2.2018
// Improved by Simone Silini 11.01.2019

require.config({
	paths : {
		//create alias to plugins
		async : '/extensions/googtimeline/async',
		goog : '/extensions/googtimeline/goog',
		propertyParser : '/extensions/googtimeline/propertyParser',
	}
});
define(["jquery", 'goog!visualization,1,packages:[corechart,table,timeline]'], function($) {'use strict';
	return {
		initialProperties : {
			version : 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 20,
					qHeight : 400
				}]
			},
			chartType : "timeline",
			showRowLabels : true,
			groupByRowLabel : false,
            colorExpression: "",
			dateFormat: "d/M/yy"
		},
		//property panel
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 3,
					max : 4
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : 
					{
						selection1 : 
						{
							type : "boolean",
							component : "switch",
							label : "Show Row Labels",
							ref : "showRowLabels",
							options : [{
								value : true,
								label : "On"
							},{
								value : false,
								label : "Off"
							}]
						},
						selection2 : 
						{
							type : "boolean",
							component : "switch",
							label : "Group Row Label",
							ref : "groupByRowLabel",
							options : [{
								value : true,
								label : "On"
							},{
								value : false,
								label : "Off"
							}]
						},
                        selection3 :
                            {
                                type : "string",
                                label : "Enter color expression",
                                ref : "colorExpression",
                                expression:"optional"
                            },
                        selection4 :
                            {
                                type : "string",
                                label : "Enter date format",
                                ref : "dateFormat",
                                expression:"optional"
                            }

					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},

		paint : function($element, layout) {

			var self = this, elemNos = [], dimCount = this.backendApi.getDimensionInfos().length;
			var data = new google.visualization.DataTable();

			data.addColumn({ type: 'string', id: 'Campaign' });
			if(dimCount==4) {
				data.addColumn({ type: 'string', id: 'Name' });
			}
        	data.addColumn({ type: 'date', id: 'Start' });
        	data.addColumn({ type: 'date', id: 'End' });

			this.backendApi.eachDataRow(function(key, row) {
				var values = [];
				row.forEach(function(cell, col) {
					
					//values.push(cell.qText);
					if(dimCount==4) {
						if(col<2)
						{
							values.push(cell.qText);
						} else {
							var myDate = new Date(cell.qText);
							values.push(myDate);
						}
					} else {
						if(col<1)
						{
							values.push(cell.qText);
						} else {
							var myDate = new Date(cell.qText);
							values.push(myDate);
						}
					}
					
				});
				data.addRows([values]);
				//selections will always be on first dimension
				elemNos.push(row[0].qElemNumber);
			});
			
			var chart = new google.visualization.Timeline($element[0]);

			//Instantiating and drawing the chart
			//var chart = new google.visualization[layout.chartType]($element[0]);

			var options = layout.colorExpression === '' ?
				{
                chartArea : {
                    left : 20,
                    top : 20,
                    width : "100%",
                    height : "100%"
                },
                timeline: { showRowLabels : layout.showRowLabels,
                    groupByRowLabel : layout.groupByRowLabel,
                    //singleColor: layout.colorExpression ,
                    colorByRowLabel: false,
                    rowLabelStyle: {fontName: 'Arial', fontSize: 15 },
                    barLabelStyle: { fontName: 'Verdana', fontSize: 13 }
                },
                hAxis: {
                    format: layout.dateFormat
                }
            } : {
				chartArea : {
					left : 20,
					top : 20,
					width : "100%",
					height : "100%"
				},
				timeline: { showRowLabels : layout.showRowLabels,
					groupByRowLabel : layout.groupByRowLabel,
					singleColor: layout.colorExpression ,
					colorByRowLabel: false,
					rowLabelStyle: {fontName: 'Arial', fontSize: 15 },
					barLabelStyle: { fontName: 'Verdana', fontSize: 13 }
				},
				hAxis: {
					format: layout.dateFormat.replace("'", "")
				}
			}


			chart.draw(data, options );
			//selections
			var selections = [];
			var tim= [];
			google.visualization.events.addListener(chart, 'select', function(e) {
				var sel = chart.getSelection();
				
				tim=sel;
				//sel.forEach(function(val) {
					
					selections[0]=elemNos[sel[0].row]
					self.selectValues(0, selections, true);
				//});
				//chart.setSelection(tim);
				//selections = selections.concat(sel);
			});
			//chart.setSelection([]);
			//chart.setSelection(tim);

		}
	};

});
