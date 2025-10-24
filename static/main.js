document.addEventListener('DOMContentLoaded', () => {

    // 1. SETUP D3 AND CHART DIMENSIONS
    const svg = d3.select("#kmeans-svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    // 2. SELECT DOM ELEMENTS
    const generateBtn = document.getElementById('generate-btn');
    const runBtn = document.getElementById('run-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const kSelect = document.getElementById('k-select');
    const iterationDisplay = document.getElementById('iteration-display');

    // 3. STATE VARIABLES
    let rawData = [];
    let kmeansSteps = [];
    let currentStepIndex = -1;

    // Scales and Colors
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    let xScale = d3.scaleLinear();
    let yScale = d3.scaleLinear();

    // 4. CORE VISUALIZATION FUNCTIONS

    function resetVisualization() {
        g.selectAll("*").remove(); // Limpa o gráfico inteiro (pontos, centróides, etc.)
        kmeansSteps = [];
        currentStepIndex = -1;
        iterationDisplay.textContent = 'N/A';
        runBtn.disabled = true; // Sempre desabilita até gerar novos dados
        nextStepBtn.disabled = true;
    }

    function drawChart(data) {

        g.selectAll('*').remove();

        const xExtent = d3.extent(data, d => d[0]);
        const yExtent = d3.extent(data, d => d[1]);

        // Define domains and ranges
        xScale.range([0, chartWidth]).domain([xExtent[0] - 1, xExtent[1] + 1]);
        yScale.range([chartHeight, 0]).domain([yExtent[0] - 1, yExtent[1] + 1]);

        // Draw circles
        g.selectAll(".data-point")
            .data(data)
            .enter().append("circle")
            .attr("class", "data-point")
            .attr("cx", d => xScale(d[0]))
            .attr("cy", d => yScale(d[1]))
            .attr("r", 5)
            .attr("fill", "#6c757d")
            .attr("opacity", 0.8);
    }

    function updateStep() {
        if (currentStepIndex < 0 || currentStepIndex >= kmeansSteps.length) return;

        const step = kmeansSteps[currentStepIndex];
        iterationDisplay.textContent = step.iteration;

        // A. Update Data Point Colors (Assignment Step)
        g.selectAll(".data-point")
            .data(rawData)
            .transition()
            .duration(800) // Smooth color change
            .attr("fill", (d, i) => colorScale(step.labels[i]));

        // B. Update Centroids (Update Step)
        const centroids = g.selectAll(".centroid")
            .data(step.centroids, (d, i) => i);

        centroids.enter().append("path")
            .attr("class", "centroid")
            .attr("d", d3.symbol().type(d3.symbolStar).size(200)) // Star symbol
            .attr("transform", d => `translate(${xScale(d[0])}, ${yScale(d[1])})`)
            .attr("fill", (d, i) => colorScale(i))
            .style("opacity", 0)
            .transition()
            .duration(800)
            .style("opacity", 1);

        // Update
        centroids.transition()
            .duration(1500)
            .ease(d3.easeCubic)
            .attr("transform", d => `translate(${xScale(d[0])}, ${yScale(d[1])})`);

        // Check for algorithm completion
        if (currentStepIndex < kmeansSteps.length - 1) {
            nextStepBtn.disabled = false;
        } else {
            nextStepBtn.disabled = true;
            console.log(`K-Means finished in ${step.iteration} iterations!`);
        }
    }

    // EVENT HANDLERS

    generateBtn.onclick = async () => {
        try {

            generateBtn.disabled = true;
            generateBtn.textContent = 'Generating...';

            const response = await fetch('/api/generate_data');
            if (!response.ok) throw new Error('Failed to generate data');
            const data = await response.json();
            rawData = data.data;

            resetVisualization();
            console.log("Drawing chart with data:", rawData.slice(0, 5)); // Testing
            drawChart(rawData);

            runBtn.disabled = false;
            generateBtn.textContent = '1. Regenerate Data';
            generateBtn.disabled = false;

        } catch (error) {
            console.error("Error generating data:", error);
            alert("Error generating data. Check console and Python server.");
            generateBtn.disabled = false;
            generateBtn.textContent = '1. Generate New Data (Error)';
        }
    };

    runBtn.onclick = async () => {
        if (rawData.length === 0) return;

        const k = kSelect.value;
        try {
            runBtn.disabled = true;
            nextStepBtn.disabled = true;
            iterationDisplay.textContent = 'Calculating...';

            const response = await fetch('/api/run_kmeans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ k: k })
            });
            if (!response.ok) throw new Error('Failed to run K-Means');

            const result = await response.json();
            kmeansSteps = result.steps;

            currentStepIndex = 0;
            updateStep();

            nextStepBtn.disabled = kmeansSteps.length <= 1;
            runBtn.disabled = false;

        } catch (error) {
            console.error("Error running K-Means:", error);
            alert("Error running K-Means. Check console and Python server.");
            runBtn.disabled = false;
        }
    };

    nextStepBtn.onclick = () => {
        if (currentStepIndex < kmeansSteps.length - 1) {
            currentStepIndex++;
            updateStep();
        }
    };
});
