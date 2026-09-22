import type { ShapeElement } from '../../models/ShapeElement';

interface ShapeRendererProps {
  element: ShapeElement;
}

export const ShapeRenderer = ({ element }: ShapeRendererProps) => {
  const getSvgContent = () => {
    const { shapeType, fillColor, borderColor, borderWidth = 1 } = element;
    
    const fill = fillColor ? `#${fillColor}` : 'transparent';
    const stroke = borderColor ? `#${borderColor}` : 'none';
    
    switch (shapeType) {
      case 'rect':
        return <rect x="0" y="0" width="100%" height="100%" fill={fill} stroke={stroke} strokeWidth={borderWidth} />;
      case 'roundRect':
        return <rect x="0" y="0" width="100%" height="100%" rx="8%" ry="8%" fill={fill} stroke={stroke} strokeWidth={borderWidth} />;
      case 'ellipse':
        return <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill={fill} stroke={stroke} strokeWidth={borderWidth} />;
      case 'line':
        return <line x1="0" y1="0" x2="100%" y2="100%" stroke={stroke === 'none' ? '#000' : stroke} strokeWidth={borderWidth} />;
      case 'triangle':
        return <polygon points="50,0 100,100 0,100" fill={fill} stroke={stroke} strokeWidth={borderWidth} preserveAspectRatio="none" />;
      default:
        return (
          <rect 
            x="0" 
            y="0" 
            width="100%" 
            height="100%" 
            fill={fill !== 'transparent' ? fill : '#f1f5f9'} 
            stroke={stroke !== 'none' ? stroke : '#cbd5e1'} 
            strokeWidth={borderWidth} 
            strokeDasharray="4 2" 
          />
        );
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : 'none',
        zIndex: element.zIndex,
        opacity: element.opacity !== undefined ? element.opacity : 1,
        pointerEvents: 'none',
      }}
    >
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {getSvgContent()}
      </svg>
    </div>
  );
};
