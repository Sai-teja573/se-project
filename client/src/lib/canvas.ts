import { Element, Connection } from "@shared/schema";

export function drawElement(ctx: CanvasRenderingContext2D, element: Element) {
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

export function drawConnection(
  ctx: CanvasRenderingContext2D,
  connection: Connection,
  elements: Element[]
) {
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
