/**
 * Mapa de satélite montado com peças de imagem, sem biblioteca nenhuma.
 *
 * Todo mapa da internet é feito assim por dentro: o mundo é cortado em
 * quadrados de 256 pixels, e a conta abaixo diz qual quadrado cobre uma
 * latitude e longitude num dado nível de aproximação. Um Leaflet da vida
 * serve para arrastar e dar zoom — aqui o mapa é uma figura parada, e uma
 * figura parada não precisa de 40 KB de JavaScript.
 *
 * As imagens vêm do World Imagery da Esri, que permite uso não comercial com
 * crédito visível. O crédito está no rodapé do mapa e precisa continuar lá.
 */

/** Quantas peças de lado. 3 dá 768px de mapa, que cobre bem uma cidade. */
const LADO = 3;
const TAMANHO = 256;

/** Latitude e longitude para a peça do mosaico, na projeção de sempre. */
function pecaDe(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom;
  const x = Math.floor(((lon + 180) / 360) * n);
  const r = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n);
  return { x, y };
}

export default function MapaSatelite({
  nome,
  lat,
  lon,
  zoom = 13,
  incerto = false,
}: {
  nome: string;
  lat: number;
  lon: number;
  zoom?: number;
  incerto?: boolean;
}) {
  const centro = pecaDe(lat, lon, zoom);
  const meio = Math.floor(LADO / 2);

  const pecas: { chave: string; url: string }[] = [];
  for (let dy = 0; dy < LADO; dy++) {
    for (let dx = 0; dx < LADO; dx++) {
      const x = centro.x - meio + dx;
      const y = centro.y - meio + dy;
      pecas.push({
        chave: `${x}-${y}`,
        url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`,
      });
    }
  }

  return (
    <figure className="mapa">
      <div
        className="mapa-mosaico"
        style={{ gridTemplateColumns: `repeat(${LADO}, 1fr)` }}
        role="img"
        aria-label={`Vista de satélite de ${nome}`}
      >
        {pecas.map((p) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={p.chave} src={p.url} alt="" loading="lazy" decoding="async" />
        ))}
        {/* O alfinete fica no centro geométrico. Como a peça do meio é a que
            contém o ponto, o erro é de no máximo meia peça — a algumas
            centenas de metros, que para este mapa não muda nada. */}
        <span className="mapa-alfinete" aria-hidden="true" />
      </div>

      <figcaption className="mapa-legenda">
        <strong>{nome}</strong>
        {incerto && (
          <span className="mapa-duvida">
            {" "}
            — a localização exata é discutida entre estudiosos
          </span>
        )}
        <span className="mapa-credito">Imagens: Esri World Imagery</span>
      </figcaption>
    </figure>
  );
}
