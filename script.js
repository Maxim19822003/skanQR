document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const resultOutput = document.getElementById('result');
  
    function drawLine(begin, end, color) {
      context.beginPath();
      context.moveTo(begin.x, begin.y);
      context.lineTo(end.x, end.y);
      context.lineWidth = 4;
      context.strokeStyle = color;
      context.stroke();
    }
  
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        video.srcObject = stream;
        video.addEventListener('play', () => {
          setInterval(() => {
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
              });
  
              if (code) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                resultOutput.textContent = code.data;
              }
            }
          }, 500);
        });
      })
      .catch(error => {
        console.error('Ошибка получения доступа к камере:', error);
      });
  });