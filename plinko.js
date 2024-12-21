document.addEventListener("DOMContentLoaded", function () {
    const Engine = Matter.Engine,
        Render = Matter.Render,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Events = Matter.Events;

    const engine = Engine.create();
    engine.world.gravity.y = 0.4;

    const render = Render.create({
        element: document.getElementById('plinko-board'),
        engine: engine,
        options: {
            width: 900,
            height: 800,
            wireframes: false,
            background: '#27333f',
        }
    });

    Engine.run(engine);
    Render.run(render);

    let pegs = [];

    // Creates pegs in triangular shape based on how many rows
    function createPegs(rows) {
        const pegRadius = 5;
        const spacingX = 40;
        const spacingY = 47;
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

    function clearPegs() {
        pegs.forEach(function(peg) {
            World.remove(engine.world, peg);
        });
        pegs = [];
    }

    // Default 16 rows
    createPegs(16);

    // Function to drop the ball
    function dropBall() {
        const ball = Bodies.circle(render.options.width / 2, -35, 8, {
            restitution: 0.5,  // Bounciness
            label: 'ball',  // Label to identify collisions
            render: {
                fillStyle: 'red'
            }
        });

        World.add(engine.world, ball);
    }

    // Button to drop the ball
    const dropButton = document.querySelector('.drop-ball-button');
    dropButton.addEventListener('click', dropBall);

    document.getElementById('row-select').addEventListener('change', function() {
        clearPegs();
        const rows = parseInt(this.value);
        createPegs(rows);
    });

    // let multiplierCounts = Array(17).fill(0);

    function createCatchers() {
        const boxWidth = 40;
        const boxHeight = 10;
        const totalBoxes = 17;
        const startX = (render.options.width - (totalBoxes * boxWidth)) / 2;
        const yPosition = render.options.height - 5;

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
                // const catcherIndex = parseInt(bodyA.label.split('-')[1]);
                // updateBallCount(catcherIndex);
                World.remove(engine.world, bodyB); 
            }
        });
    });

    // function updateBallCount(index) {
    //     multiplierCounts[index]++;
    //     updateGraph();
    // }

    // function updateGraph() {
    //     multiplierCounts.forEach((count, index) => {
    //         const bar = document.getElementById(`bar-${index}`);
    //         bar.style.height = `${count * 10}px`; 
    //     });
    // }
});
