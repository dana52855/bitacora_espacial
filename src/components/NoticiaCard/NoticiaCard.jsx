
import "./NoticiaCard.css";

function NoticiaCard({ titulo, resumen, imagen, fuente, fecha, enlace }) {

    // Formatear la fecha
    const fechaFormateada = new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium"
    }).format(new Date(fecha));

    return (
        <article className="noticia-card">

            {/* 1. Imagen */}
            <img
                className="noticia-card__imagen"
                src={imagen}
                alt=""
                loading="lazy"
            />

            {/* 2. Título */}
            <h3 className="noticia-card__titulo">
                {titulo}
            </h3>

            {/* 3. Resumen */}
            <p className="noticia-card__resumen">
                {resumen}
            </p>

            {/* 4. Metadatos */}
            <p className="noticia-card__meta">
                {fuente} · <time dateTime={fecha}>{fechaFormateada}</time>
            </p>

            {/* 5. Enlace */}
            <a
                className="noticia-card__enlace"
                href={enlace}
                target="_blank"
                rel="noopener noreferrer"
            >
                Leer noticia
            </a>

        </article>
    );
}

export default NoticiaCard;
