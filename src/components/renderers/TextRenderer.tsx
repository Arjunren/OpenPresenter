import type { TextElement } from '../../models/TextElement';

interface TextRendererProps {
  element: TextElement;
  slideWidth: number;
}

export const TextRenderer = ({ element, slideWidth }: TextRendererProps) => {
  const slideWidthPoints = slideWidth / 12_700;

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
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {element.paragraphs.map((p, pIdx) => (
        <p
          key={pIdx}
          style={{
            margin: 0,
            textAlign: p.alignment || 'left',
            paddingLeft: p.level ? `${p.level * 1.25}em` : undefined
          }}
        >
          {p.bullet && <span aria-hidden="true">{p.bullet} </span>}
          {p.runs.map((r, rIdx) => (
            <span
              key={rIdx}
              style={{
                fontWeight: r.isBold ? 'bold' : 'normal',
                fontStyle: r.isItalic ? 'italic' : 'normal',
                textDecoration: r.isUnderline ? 'underline' : 'none',
                color: r.fontColor ? `#${r.fontColor}` : 'inherit',
                fontSize: r.fontSize
                  ? `calc(${(r.fontSize / slideWidthPoints) * 100}cqw)`
                  : 'inherit',
                fontFamily: r.fontFamily ? `"${r.fontFamily}", sans-serif` : 'inherit',
                whiteSpace: 'pre-wrap'
              }}
            >
              {r.text}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};
