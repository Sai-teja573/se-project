export function drawElement(ctx, element) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  switch (element.type) {
    case 'bubble':
      ctx.beginPath();
      ctx.arc(element.x, element.y, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
    case 'entity':
      ctx.beginPath();
      ctx.rect(element.x - 50, element.y - 30, 100, 60);
      ctx.fill();
      ctx.stroke();
      break;
    case 'datastore':
      ctx.beginPath();
      ctx.moveTo(element.x - 50, element.y - 15);
      ctx.lineTo(element.x + 50, element.y - 15);
      ctx.lineTo(element.x + 50, element.y + 15);
      ctx.lineTo(element.x - 50, element.y + 15);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
  }

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(element.text, element.x, element.y);
  ctx.restore();
}

export function drawConnection(ctx, connection, elements) {
  const fromElement = elements.find(e => e.id === connection.from);
  const toElement = elements.find(e => e.id === connection.to);

  if (!fromElement || !toElement) return;

  ctx.save();
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(fromElement.x, fromElement.y);
  ctx.lineTo(toElement.x, toElement.y);
  ctx.stroke();

  // Draw arrow
  const angle = Math.atan2(toElement.y - fromElement.y, toElement.x - fromElement.x);
  const arrowLength = 15;
  const arrowWidth = 8;

  ctx.beginPath();
  ctx.moveTo(toElement.x, toElement.y);
  ctx.lineTo(
    toElement.x - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
    toElement.y - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
  );
  ctx.lineTo(
    toElement.x - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
    toElement.y - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawTempConnection(ctx, fromElement, toPoint) {
  ctx.save();
  
  // Use dashed line for temporary connection
  ctx.setLineDash([5, 3]);
  ctx.strokeStyle = '#666666';
  ctx.lineWidth = 2;
  
  // Draw the line from element to current mouse position
  ctx.beginPath();
  ctx.moveTo(fromElement.x, fromElement.y);
  ctx.lineTo(toPoint.x, toPoint.y);
  ctx.stroke();
  
  // Draw arrow at the endpoint
  const angle = Math.atan2(toPoint.y - fromElement.y, toPoint.x - fromElement.x);
  const arrowLength = 15;
  const arrowWidth = 8;

  ctx.beginPath();
  ctx.moveTo(toPoint.x, toPoint.y);
  ctx.lineTo(
    toPoint.x - arrowLength * Math.cos(angle) + arrowWidth * Math.sin(angle),
    toPoint.y - arrowLength * Math.sin(angle) - arrowWidth * Math.cos(angle)
  );
  ctx.lineTo(
    toPoint.x - arrowLength * Math.cos(angle) - arrowWidth * Math.sin(angle),
    toPoint.y - arrowLength * Math.sin(angle) + arrowWidth * Math.cos(angle)
  );
  ctx.closePath();
  ctx.fillStyle = '#666666';
  ctx.fill();
  
  ctx.restore();
}
