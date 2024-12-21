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
            height: 800,
            wireframes: false, 
            background: '#27333f',
        }
    });

    Engine.run(engine);
    Render.run(render);

    function createPegs(rows) {
        const pegs = [];
        const pegRadius = 5;
        const spacingX = 30;
        const spacingY = 40;
        const offsetX = 450;
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

    createPegs(16);

    function dropBall() {
        const ball = Bodies.circle(450, 0, 5, {
            restitution: 0.5,  // Bounciness
            render: {
                fillStyle: 'red'
            }
        });

        World.add(engine.world, ball);
    }

    // Button to drop the ball
    const dropButton = document.querySelector('.drop-ball-button');
    dropButton.addEventListener('click', dropBall);
});
