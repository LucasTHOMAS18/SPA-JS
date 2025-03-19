(() => {
    const canvas = document.getElementById('starfield-canvas');
    const ctx = canvas.getContext('2d');
  
    let stars = [];
    const numStars = 300; 
    let shootingStars = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
  
    function createStars() {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          alpha: Math.random(),
          alphaChange: (Math.random() * 0.02) + 0.005
        });
      }
    }
    createStars();
  
    function createShootingStar() {
      let startX = Math.random() * canvas.width;
      let startY = Math.random() * canvas.height * 0.5; // partie supérieure
      let length = Math.random() * 80 + 80; // entre 80 et 160 px
      let speed = Math.random() * 10 + 10;
      shootingStars.push({
        x: startX,
        y: startY,
        length: length,
        speed: speed,
        angle: Math.PI / 6,
        opacity: 0,
        fadingIn: true
      });
    }
  
    function updateShootingStars() {
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        let s = shootingStars[i];
        if (s.fadingIn) {
          s.opacity += 0.05;
          if (s.opacity >= 1) {
            s.fadingIn = false;
          }
        } else {
          s.opacity -= 0.01;
        }
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        if (s.x > canvas.width || s.y > canvas.height || s.opacity <= 0) {
          shootingStars.splice(i, 1);
        }
      }
    }
  
    function drawStars() {
      for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += star.alphaChange;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.alphaChange = -star.alphaChange;
        }
      }
    }
  
    function drawShootingStars() {
      for (let s of shootingStars) {
        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
        ctx.stroke();
        ctx.restore();
      }
    }
  
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStars();
      updateShootingStars();
      drawShootingStars();
      requestAnimationFrame(animate);
    }
    animate();
  
    setInterval(createShootingStar, 3000 + Math.random() * 2000);
  })();