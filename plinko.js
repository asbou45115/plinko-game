document.addEventListener("DOMContentLoaded", function () {
    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

    const engine = Engine.create();
    engine.world.gravity.y = 0.142;

    const render = Render.create({
        element: document.getElementById('plinko-board'),
        engine: engine,
        options: {
            width: 800,
            height: 680,
            wireframes: false,
            background: '#27333f',
        }
    });

    Engine.run(engine);
    Render.run(render);

    let pegs = [];
    let totalProfit = 0.0;
    const betInput = document.getElementById('bet-amount');
    const totalProfitDisplay = document.getElementById('total-profit-display');
    const multiplierValues = [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000];

    // Creates pegs in triangular shape based on how many rows
    function createPegs(rows) {
        const pegRadius = 5;
        const spacingX = 40;
        const spacingY = 40;
        const offsetX = render.options.width / 2;
        const offsetY = -15;

        for (let row = 2; row < rows + 2; row++) {
            for (let col = 0; col <= row; col++) {
                const xPos = offsetX - row * spacingX / 2 + col * spacingX;
                const yPos = offsetY + row * spacingY;

                const peg = Bodies.circle(xPos, yPos, pegRadius, {
                    isStatic: true,
                    render: {
                        fillStyle: 'white'
                    }
                });
                pegs.push(peg);
            }
        }

        World.add(engine.world, pegs);
    }

    // Default 16 rows
    createPegs(16);

    // Function to drop the ball
    function dropBall() {
        const maxX = 35;
        const minX = -35;
        const offsetX = Math.random() * (maxX - minX) + minX;
        const offsetY = -35;
        const ballRadius = 7.5;

        const ball = Bodies.circle(render.options.width / 2 + offsetX, offsetY, ballRadius, {
            restitution: 1,  // Bounciness
            label: 'ball',  // Label to identify collisions
            render: {
                fillStyle: 'red'
            }
        });

        World.add(engine.world, ball);
    }

    // Button to drop the ball
    const dropButton = document.querySelector('.drop-ball-button');
    dropButton.addEventListener('click', function () {
        const betAmount = parseFloat(betInput.value);

        if (betAmount > 0) {
            dropBall();
        } else {
            alert("Please enter a valid bet amount.");
        }
    });

    function updateProfit(multiplier) {
        const betAmount = parseFloat(betInput.value);
        const profit = betAmount * multiplier - betAmount;
        totalProfit += profit;

        totalProfitDisplay.textContent = `Total Profit: ${totalProfit.toFixed(10)}`;

        if (totalProfit > 0) {
            totalProfitDisplay.className = "profit-positive";
        } else if (totalProfit < 0) {
            totalProfitDisplay.className = "profit-negative";
        } else {
            totalProfitDisplay.className = "profit-zero";
        }
    }

    let multiplierCounts = Array(17).fill(0);

    function createCatchers() {
        const boxWidth = 40;
        const boxHeight = 8;
        const totalBoxes = 17;
        const startX = (render.options.width - (totalBoxes * boxWidth)) / 2;
        const yPosition = render.options.height + 5;

        for (let i = 0; i < totalBoxes; i++) {
            const xPosition = startX + i * boxWidth;
            const catcher = Bodies.rectangle(xPosition + boxWidth / 2, yPosition, boxWidth, boxHeight, {
                isStatic: true,
                label: `catcher-${i}`,
                render: {
                    fillStyle: 'transparent'  // Make the actual physics box invisible
                }
            });

            World.add(engine.world, catcher);
        }
    }

    createCatchers();

    // Collision event to detect when a ball falls into a multiplier box
    Events.on(engine, 'collisionStart', function(event) {
        const pairs = event.pairs;

        pairs.forEach(function(pair) {
            const { bodyA, bodyB } = pair;

            // Check if a ball collides with a catcher
            if (bodyA.label.startsWith('catcher') && bodyB.label === 'ball') {
                const catcherIndex = parseInt(bodyA.label.split('-')[1]);
                updateBallCount(catcherIndex);
                updateProfit(multiplierValues[catcherIndex]);
                World.remove(engine.world, bodyB); 
            }
        });
    });

    function updateBallCount(index) {
        multiplierCounts[index]++;
        updateGraph();
    }

    function updateGraph() {
        const maxHeight = 200;
        const maxCount = Math.max(...multiplierCounts);
        updateYAxis(maxCount);
    
        multiplierCounts.forEach((count, index) => {
            const bar = document.getElementById(`bar-${index}`);
            const barHeight = (count / maxCount) * maxHeight;
            bar.style.height = `${Math.max(barHeight, 2)}px`;
        });
    }
    
    function updateYAxis(maxCount) {
        const yAxis = document.getElementById('y-axis');
        const yAxisLabels = yAxis.getElementsByClassName('y-axis-label');
        const labelCount = yAxisLabels.length;
    
        for (let i = 0; i < labelCount; i++) {
            yAxisLabels[labelCount - i - 1].textContent =  Math.floor((maxCount / (labelCount - 1)) * i);
        }
    }
    
    // Bet control buttons
    const halfBetButton = document.getElementById('half-bet');
    const doubleBetButton = document.getElementById('double-bet');

    halfBetButton.addEventListener('click', function () {
        let currentBet = parseFloat(betInput.value);
        if (currentBet > 0) {
            betInput.value = (currentBet / 2).toFixed(10);
        }
    });

    doubleBetButton.addEventListener('click', function () {
        let currentBet = parseFloat(betInput.value);
        betInput.value = (currentBet * 2).toFixed(10);
    });
});
