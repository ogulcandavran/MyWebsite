const glitchTarget = document.querySelector("#glitch-target");
const ctaContainer = document.querySelector(".home__main__cta-container__cta");
const navElement = document.querySelector(".nav__element");

ctaContainer.addEventListener("mouseover", () =>
  glitchTarget.classList.add("glitch")
);
ctaContainer.addEventListener("mouseleave", () =>
  glitchTarget.classList.remove("glitch")
);

(function game() {
  const canvas2 = document.querySelector("#matterjs");
  
  var Example = Example || {};
  Example.bridge = function () {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Body = Matter.Body,
      Composites = Matter.Composites,
      Common = Matter.Common,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

    var engine = Engine.create(),
      world = engine.world;

    var render = Render.create({
      canvas: canvas2,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        showAngleIndicator: false,
        wireframes: false,
      },
    });

    Render.run(render);

    var runner = Runner.create();
    Runner.run(runner, engine);

    var group = Body.nextGroup(true);

    var bridge = Composites.stack(160, 290, 15, 1, 0, 0, function (x, y) {
      return Bodies.rectangle(x - 20, y, 53, 20, {
        collisionFilter: { group: group },
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.05,
        render: {
          fillStyle: "#66fcf1",
          strokeStyle: "#66fcf1",
          lineWidth: 1,
        },
      });
    });

    Composites.chain(bridge, 0.3, 0, -0.3, 0, {
      stiffness: 1,
      length: 0,
      render: {
        visible: false,
      },
    });

    var stack = Composites.stack(250, 50, 6, 3, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 50, 50, {
        render: { fillStyle: "#080808", strokeStyle: "#66fcf1", lineWidth: 1 },
      });
    });

    World.add(world, [
      bridge,
      stack,
      Bodies.rectangle(400, 0, 800, 50, {
        isStatic: true,
        render: {
          fillStyle: "#080808",
          strokeStyle: "#66fcf1",
          lineWidth: 1,
          visible: false,
        },
      }),
      Bodies.rectangle(400, 600, 800, 50, {
        isStatic: true,
        render: {
          fillStyle: "#080808",
          strokeStyle: "#66fcf1",
          lineWidth: 1,
          visible: false,
        },
      }),
      Bodies.rectangle(800, 300, 50, 600, {
        isStatic: true,
        render: {
          fillStyle: "#080808",
          strokeStyle: "#66fcf1",
          lineWidth: 1,
          visible: false,
        },
      }),
      Bodies.rectangle(0, 300, 50, 600, {
        isStatic: true,
        render: {
          fillStyle: "#080808",
          strokeStyle: "#66fcf1",
          lineWidth: 1,
          visible: false,
        },
      }),
      Bodies.rectangle(30, 590, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 },
        render: { fillStyle: "#080808", strokeStyle: "#66fcf1", lineWidth: 1 },
      }),
      Bodies.rectangle(770, 590, 220, 380, {
        isStatic: true,
        chamfer: { radius: 20 },
        render: { fillStyle: "#080808", strokeStyle: "#66fcf1", lineWidth: 1 },
      }),
      Constraint.create({
        pointA: { x: 140, y: 410 },
        bodyB: bridge.bodies[0],
        pointB: { x: -25, y: 0 },
        length: 2,
        stiffness: 0.9,
      }),
      Constraint.create({
        pointA: { x: 660, y: 410 },
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        pointB: { x: 25, y: 0 },
        length: 2,
        stiffness: 0.9,
      }),
    ]);

    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.1,
          render: {
            visible: false,
          },
        },
      });

    World.add(world, mouseConstraint);

    render.mouse = mouse;
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });
    return {
      engine: engine,
      runner: runner,
      render: render,
      canvas: render.canvas,
      stop: function () {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
      },
    };
  };

  Example.bridge();
})();

function fusion() {
  const canvas = document.querySelector("#fusion");
  const ctx = canvas.getContext("2d");
  console.log(canvas);
  let width;
  let height;
  class Line {
    constructor(origin, size, length, color, style = "pattern") {
      this.size = size;
      this.origin = origin;
      this.length = length;
      this.color = color;
      this.style = style;
      this.origin = `M${origin.x},${origin.y}`;
      this.offSet = 0;
      this.line = null;
      this.offSetSpeed = length / size;
    }
    getColorString() {
      return `hsla(${this.color.h}deg,${this.color.s}%,${this.color.l}%,${this.color.a})`;
    }
    generators() {
      return [
        {
          line: `h${this.size}`,
          mag: this.size,
        },
        {
          line: `h-${this.size}`,
          mag: this.size,
        },
        {
          line: `v${this.size}`,
          mag: this.size,
        },
        {
          line: `v-${this.size}`,
          mag: this.size,
        },
        {
          line: `l${this.size},${this.size}`,
          mag: Math.hypot(this.size, this.size),
        },
        {
          line: `l${this.size}-${this.size}`,
          mag: Math.hypot(this.size, this.size),
        },
        {
          line: `l-${this.size},${this.size}`,
          mag: Math.hypot(this.size, this.size),
        },
        {
          line: `l-${this.size}-${this.size}`,
          mag: Math.hypot(this.size, this.size),
        },
      ];
    }
    generate() {
      let segments = this.generators(this.size);
      let path = this.origin;
      let mag = 0;
      let fragment;
      let i;
      for (i = 0; i < this.length; i += 1) {
        fragment = segments[(Math.random() * segments.length) | 0];
        path += ` ${fragment.line}`;
        mag += fragment.mag;
      }
      this.line = {
        path,
        mag,
      };
      return this;
    }
    renderStyle(style) {
      if (style === "glitches") {
        ctx.lineDashOffset = this.line.mag + this.offSet;
        ctx.setLineDash([
          this.size ** 1.5,
          (this.line.mag / this.length) * this.size ** 2,
        ]);
        this.offSet += 20;
        // this.size / (this.size ** 2);
        ctx.lineWidth = 2;
        return this;
      }
      if (style === "pattern") {
        ctx.lineDashOffset = this.line.mag - this.offSet;
        ctx.setLineDash([this.line.mag, this.line.mag]);
        this.offSet += 10;
        //this.size / (this.size ** 100);
        ctx.lineWidth = 0.2;
      }
    }
    mutatePath() {
      let lineFragment = this.line.path.split(" ").slice(1);
      let generator = this.generators();
      lineFragment[(Math.random() * lineFragment.length) | 0] =
        generator[(Math.random() * generator.length) | 0].line;
      this.line.path = `${this.line.path.split(" ")[0]} ${lineFragment.join(
        " "
      )}`;
    }
    draw() {
      !this.line && this.generate();

      ctx.strokeStyle = this.getColorString();
      this.renderStyle(this.style);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke(new Path2D(this.line.path));
      return this;
    }
  }
  function clear() {
    ctx.fillStyle = `hsla(0, 0%, 3.1%, 1)`;
    ctx.fillRect(0, 0, width, height);
  }
  function generateLines(amount) {
    let lines = [];
    let styles = [
      {
        size: 1.25,
        style: "pattern",
        color: { h: 210, s: 100, l: 70, a: 0.5 },
      },
      { size: 2.5, style: "pattern", color: { h: 190, s: 90, l: 50, a: 0.3 } },
      { size: 5, style: "pattern", color: { h: 210, s: 70, l: 60, a: 0.2 } },
      { size: 10, style: "pattern", color: { h: 310, s: 80, l: 55, a: 0.15 } },
      { size: 20, style: "pattern", color: { h: 200, s: 25, l: 35, a: 0.12 } },
      { size: 20, style: "pattern", color: { h: 210, s: 20, l: 40, a: 0.12 } },
      { size: 40, style: "pattern", color: { h: 190, s: 40, l: 50, a: 0.12 } },
      { size: 80, style: "pattern", color: { h: 220, s: 50, l: 60, a: 0.12 } },
      {
        size: 40,
        style: "glitches",
        color: { h: 300, s: 100, l: 50, a: 0.15 },
      },
      { size: 20, style: "glitches", color: { h: 175, s: 96, l: 69, a: 0.15 } },
      { size: 60, style: "glitches", color: { h: 30, s: 100, l: 50, a: 0.15 } },
    ];
    for (let i = 0; i < amount; i += 1) {
      let style = styles[(Math.random() ** 2 * styles.length) | 0];
      lines.push(
        new Line(
          { x: width * 0.5, y: height * 0.5 },
          style.size,
          500 + Math.random() * 1000,
          style.color,
          style.style
        )
      );
    }
    return lines;
  }
  let id;
  function resize() {
    id = cancelAnimationFrame(id);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const lines = generateLines(40);
    function update() {
      if (!(id % 3)) {
        clear();
        lines.forEach((line) => {
          line.draw();
          if (!(id % 5) && Math.random() > 0.95) {
            line.mutatePath();
          }
        });
      }
      id = requestAnimationFrame(update);
    }
    id = requestAnimationFrame(update);
  }
  window.addEventListener("resize", resize, {
    passive: true,
  });
  resize();
}

fusion();

