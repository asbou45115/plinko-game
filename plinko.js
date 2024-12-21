document.addEventListener("DOMContentLoaded", function () {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Events = Matter.Events;

    const engine = Engine.create();
    engine.world.gravity.y = 0.4;

    // Set up the renderer
    const render = Render.create({
        element: document.getElementById('plinko-board'),
        engine: engine,
        options: {
            width: 900,
            height: 1000,
            wireframes: false, 
            background: '#27333f',
        }
    });

    Engine.run(engine);
    Render.run(render);

    let pegs = [];

    function createPegs(rows) {
        const pegRadius = 5;
        const spacingX = 40;
        const spacingY = 47;
        const offsetX = render.options.width / 2;
        const offsetY = 20;

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

    createPegs(16);

    function dropBall() {
        const ball = Bodies.circle(render.options.width / 2, 0, 8, {
            restitution: 0.6,  // Bounciness
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
    })
});
