
import { useEffect, useState } from "react";
import NoticiaCard from "./components/NoticiaCard/NoticiaCard";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [termino, setTermino] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  function buscar(evento) {
    evento.preventDefault();
    setTermino(textoBusqueda.trim());
  }

  useEffect(() => {
    const controlador = new AbortController();

    async function obtenerNoticias() {
      setCargando(true);
      setError("");

      try {
        const parametros = new URLSearchParams();

        parametros.set("limit", "12");

        if (termino) {
          parametros.set("search", termino);
        }

        const respuesta = await fetch(
          `${API_URL}/articles/?${parametros.toString()}`,
          { signal: controlador.signal }
        );

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar las noticias.");
        }

        const datos = await respuesta.json();

        setNoticias(datos.results);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    obtenerNoticias();

    return () => {
      controlador.abort();
    };
  }, [termino]);

  function verTodas() {
    setTextoBusqueda("");
    setTermino("");
  }

  return (
    <>
      <header className="contenedor cabecera">
        <p>Bitacora Espacial</p>

        <nav aria-label="principal">
          <div>
            <ul>
              <li><a href="#noticias">Noticias</a></li>
              <li><a href="#blogs">Blogs</a></li>
              <li><a href="#acerca">Acerca</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main className="contenedor">
        <h1>Espacio</h1>

        <form className="buscador" onSubmit={buscar}>
          <label htmlFor="busqueda">Buscar por tema</label>

          <input
            id="busqueda"
            name="q"
            type="search"
            placeholder="Ej.: Mars, Artemis, SpaceX"
            value={textoBusqueda}
            onChange={(evento) => setTextoBusqueda(evento.target.value)}
          />

          <button type="submit">Buscar</button>

          <button type="button" onClick={verTodas}>
            Ver todas
          </button>
        </form>

        <section aria-labelledby="ultimas-noticias">
          <h2 id="ultimas-noticias">Ultimas noticias</h2>

          {cargando && (
            <p role="status">Cargando noticias...</p>
          )}

          {error && (
            <p role="alert">Error: {error}</p>
          )}

          {!cargando && !error && noticias.length === 0 && (
            <p role="status">
              No hay noticias para "{termino}".
            </p>
          )}

          <div className="grid-noticias">
            {!cargando && !error && noticias.map((noticia) => (
              <NoticiaCard
                key={noticia.id}
                titulo={noticia.title}
                resumen={noticia.summary}
                imagen={noticia.image_url}
                fuente={noticia.news_site}
                fecha={noticia.published_at}
                enlace={noticia.url}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="contenedor">
        <p>Spaceflight News API.</p>
      </footer>
    </>
  );
}

export default App;
