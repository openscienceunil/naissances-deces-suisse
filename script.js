var svg = d3.select('svg');

var width = +svg.attr('width');
var height = +svg.attr('height');

const births_color = "lightblue";
const deaths_color = "red";

let data = [];

function renderSingle(datapoint) {
	const graphData = [
		{
			title: "Naissances",
			value: +datapoint.births
		},
		{
			title: "Décès",
			value: +datapoint.deaths
		}
	]
	
	// créer le canevas
	document.getElementsByTagName('svg')[0].innerHTML = ""
	const margin = {top: 50, right: 50, bottom: 20, left: 50};
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	// créer les échelles
	const xScale = d3.scaleBand()
		.domain(graphData.map(x => x.title))
		.range([0, innerWidth])
		.padding(0.1);
	const yScale = d3.scaleLinear()
		.domain([Math.max.apply(Math, graphData.map(x => x.value)), 0])
		.range([0, innerHeight]);
	
	// créer le titre
	svg.append("text")
		.attr("x", width / 2)
		.attr("y", margin.top / 2)
		.attr("text-anchor", "middle")
		.style("font-size", "20px")
		.style("font-weight", "bold")
		.style("text-decoration", "underline")
		.text("Naissances vs décès en Suisse en " + datapoint.year);

	// ajouter les espacements
	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	// dessiner les axes
	g.append('g').call(d3.axisLeft(yScale));
	g.append('g').call(d3.axisBottom(xScale))
		.attr('transform', `translate(0,${innerHeight})`);  

	// dessiner les barres verticales
	g.selectAll('rect').data(graphData)
		.enter().append('rect')
		.attr('y', d => yScale(d.value))
		.attr('x', d => xScale(d.title))
		.attr('height', d => innerHeight-yScale(d.value))
		.attr('width', xScale.bandwidth())
		.style('fill', d => d.title == "Naissances" ? births_color : deaths_color)
		.style('opacity', .7);
}

function renderTotal(data) {
	// créer le canevas
	document.getElementsByTagName('svg')[0].innerHTML = ""

	// espacements autour du graph
	const margin = {top: 50, right: 50, bottom: 20, left: 50};
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	
	// créer les échelles
	// échelle des x
	const xScale = d3.scaleBand()
		.domain(data.map(d => d.year))
		.range([0, innerWidth])
		.padding(0.1);
	
	// échelle des y
	const yScale = d3.scaleLinear()
		.domain([d3.max(data, d => d.births), 0])
		.range([0, innerHeight]);
	
	// titre
	svg.append("text")
		.attr("x", width / 2)
		.attr("y", margin.top / 2)
		.attr("text-anchor", "middle")
		.style("font-size", "20px")
		.style("font-weight", "bold")
		.style("text-decoration", "underline")
		.text("Visualisation 1877 - 2020");

	// espacement
	const g = svg.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);
	
	// dessiner les axes
	g.append('g').call(d3.axisLeft(yScale));
	g.append('g')
		.call(d3
				.axisBottom(xScale)
				.tickValues(
					xScale
					.domain()
					.filter(function(year, i) 
			{
			return ((!(year % 5)) || (i == (data.length-1)));
		})))
		.attr('transform', `translate(0,${innerHeight})`);

	// Elément pour la box de légende
	var div = svg.append("g")
		.attr("class", "tooltip")
		.style("opacity", 0);
	div.append("rect").attr("id","box").attr("class","box")
						.attr('height', "2.4em")
						.attr('width', "150px")
						.style("fill", "white")
						.style("stroke-width", 1)
						.style("stroke", "black");
	let divtext = div.append("text").attr("fill", "black");
	divtext.append("tspan").attr("id","legendA").attr('x', "0.1em").attr('dy', "0.9em");
	divtext.append("tspan").attr("id","legendB").attr('x', "0.1em").attr('dy', "1.3em");
	
	// dessiner les barres verticales
	let container = g.selectAll('rect').data(data).enter();
	container.append('rect')
		.attr('y', d => yScale(d.births))
		.attr('x', d => xScale(d.year))
		.attr('height', d => innerHeight-yScale(d.births))
		.attr('width', xScale.bandwidth())
		.style('fill', births_color)
		.style('opacity', .6)
		.on("mouseover", function(event, d) {
			d3.select(this)
				.style("stroke", "black")
				.style("opacity", 1);

			div.style("opacity", 1);
			let[x, y] = d3.pointer(event);
			x = margin.left + x - 100;
			y = margin.top + y - 100;
			div.attr("transform","translate("+x+","+y+")");
			div.select("#legendA").text("Naissances: " + d.births);
			div.select("#legendB").text("Décès: " + d.deaths);
		})
		.on("mouseout", function(d) {
			div.style("opacity", 0);
			d3.select(this)
				.style("stroke", "none")
				.style("opacity", .7);
		});
	
	container.append('rect')
		.attr('y', d => yScale(d.deaths))
		.attr('x', d => xScale(d.year))
		.attr('height', d => innerHeight-yScale(d.deaths))
		.attr('width', xScale.bandwidth())
		.attr('value', d => d.deaths)
		.style('fill', deaths_color)
		.style('opacity', .4)
		.on("mouseover", function(event, d) {
			d3.select(this)
				.style("stroke", "black")
				.style("opacity", 1);

			div.style("opacity", 1);
			let[x, y] = d3.pointer(event);
			x = margin.left + x - 100;
			y = margin.top + y - 100;
			div.attr("transform","translate("+x+","+y+")");
			div.select("#legendA").text("Naissances: " + d.births);
			div.select("#legendB").text("Décès: " + d.deaths);
		})
		.on("mouseout", function(d) {
			div.style("opacity", 0);
			d3.select(this)
				.style("stroke", "none")
				.style("opacity", .4);
		});
}

function addYearsSelections(data) {
	let select = document.getElementById('selectAnnee');

	let options = ["Toutes", ...data.map(x => x.year).reverse()];
	for (let i = 0; i < options.length; i++) {
		let option = document.createElement('option');
		option.appendChild(document.createTextNode(options[i]));
		option.value = options[i];
		if (i == 0) {
			option.selected = true;
		}
		select.append(option);
	}
}

function replot() {
	const select = document.getElementById('selectAnnee');
	const value = select.value;
	if (value != "Toutes") {
		const d = data.filter(x => x.year == value)[0];
		renderSingle(d);
	}
	else {
		select.selectedIndex = 0;
		renderTotal(data);
	}
}

async function charger() {
	return await d3.csv('data/final.csv', function(d) {
		return {
			year: d.year, 
			births: +d.births_total,
			deaths: +d.deaths_total,
		}
	});
}

charger()
	.then(d => 
	{ 
		data = d.slice();
		addYearsSelections(d);
		replot();
	})

