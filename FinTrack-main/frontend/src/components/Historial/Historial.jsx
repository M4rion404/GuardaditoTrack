import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "./Historial.css";

const TIPOS = ["todos", "transaccion", "presupuesto", "categoria"];
const CAMPOS_EXCLUIDOS = ["_id", "__v", "fecha", "createdAt", "updatedAt", "fecha_creacion"];
const TRADUCCIONES = {
  titulo: "Título",
  Titulo: "Título",
  descripcion: "Descripción",
  Descripcion: "Descripción",
  accion: "Acción",
  metodo_pago: "Método de pago",
  monto: "Monto",
  estado: "Estado",
  tipo: "Tipo",
  usuario: "Usuario",
  fecha: "Fecha",
  divisa_asociada: "Divisa",
  categoria_asociada: "Categoría",
  presupuesto_asociado: "Presupuesto",
  meta_ahorro: "Meta de Ahorro",
  monto_inicial: "Monto Inicial",
  dinero_ahorrado: "Dinero Ahorrado",
  dinero_gastado: "Dinero Gastado"
};
const ELEMENTOS_POR_PAGINA = 7;

const formatearCampo = (campo) =>
  TRADUCCIONES[campo] || campo.charAt(0).toUpperCase() + campo.slice(1);

const formatearFecha = (fechaIso) => new Date(fechaIso).toLocaleString();

const limpiarCampos = (obj, refs) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([k]) => !CAMPOS_EXCLUIDOS.includes(k))
      .map(([k, v]) => {
        if (k === "divisa_asociada") {
          const nombre = typeof v === "string"
            ? refs.divisas?.[v]
            : v?.nombre || v?.titulo;
          return [k, nombre || "Sin divisa"];
        }

        if (k === "categoria_asociada") {
          const nombre = typeof v === "string"
            ? refs.categorias?.[v]
            : v?.Titulo || v?.titulo;
          return [k, nombre || "Sin categoría"];
        }

        if (k === "presupuesto_asociado") {
          const nombre = typeof v === "string"
            ? refs.presupuestos?.[v]
            : v?.titulo;
          return [k, nombre || "Sin título"];
        }

        if (typeof v === "object" && v !== null && v.titulo) {
          return [k, v.titulo];
        }

        return [k, v];
      })
  );




const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [seleccionado, setSeleccionado] = useState(null);
  const [userId, setUserId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [divisas, setDivisas] = useState({});
  const [categorias, setCategorias] = useState({});
  const [presupuestos, setPresupuestos] = useState({});

  // Cargar referencias cuando userId cambie
  useEffect(() => {
    if (!userId) return;
    const cargarReferencias = async () => {
      try {
        const [resDiv, resCat, resPres] = await Promise.all([
          axios.get("http://localhost:3000/api/divisas"),
          axios.get(`http://localhost:3000/api/categorias/${userId}`),
          axios.get(`http://localhost:3000/api/presupuestos/${userId}`),
        ]);
        setDivisas(
          Object.fromEntries(
            resDiv.data.map((d) => [
              d._id,
              d.nombre || d.titulo || "Sin nombre",
            ])
          )
        );
        setCategorias(
          Object.fromEntries(
            resCat.data.map((c) => [
              c._id,
              c.Titulo || c.titulo || "Sin categoría",
            ])
          )
        );
        setPresupuestos(
          Object.fromEntries(
            resPres.data.map((p) => [p._id, p.titulo || "Sin título"])
          )
        );
      } catch (err) {
        setError("Error cargando referencias.");
      }
    };
    cargarReferencias();
  }, [userId]);

  // Obtener userId solo una vez
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    else setError("Usuario no encontrado.");
  }, []);

  // Obtener historial cuando cambia filtro o userId
  const obtenerHistorial = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const url =
        filtroTipo === "todos"
          ? `http://localhost:3000/api/historial/${userId}`
          : `http://localhost:3000/api/historial/${userId}?tipo=${filtroTipo}`;
      const { data } = await axios.get(url);
      setHistorial(Array.isArray(data) ? data : []);
      setPaginaActual(1);
    } catch (err) {
      setError("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  }, [filtroTipo, userId]);

  useEffect(() => {
    obtenerHistorial();
  }, [obtenerHistorial]);

  const refs = useMemo(
    () => ({ divisas, categorias, presupuestos }),
    [divisas, categorias, presupuestos]
  );

  const mostrarCambios = (item) => {
    setSeleccionado(seleccionado?._id === item._id ? null : item);
  };

  const renderCambios = (item) => {
    const { accion, datos_antes, datos_despues } = item;
    const antes = datos_antes ? limpiarCampos(datos_antes, refs) : {};
    const despues = datos_despues ? limpiarCampos(datos_despues, refs) : {};

    if (accion.includes("Actualizacion") && datos_antes && datos_despues) {
      const cambios = Object.keys(antes).filter(
        (key) => antes[key] !== despues[key]
      );
      return (
        <div style={{ marginBottom: "2rem" }}>
          <h5>Datos antes:</h5>
          <ul>
            {Object.entries(antes).map(([clave, valor]) => (
              <li key={clave}>
                <strong>{formatearCampo(clave)}:</strong> {valor}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem" }} />
          <h5>Datos después:</h5>
          <ul>
            {Object.entries(despues).map(([clave, valor]) => (
              <li key={clave}>
                <strong>{formatearCampo(clave)}:</strong> {valor}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem" }} />
          <h5>Cambios:</h5>
          {cambios.length > 0 ? (
            <ul className="cambios-lista">
              {cambios.map((clave) => (
                <li key={clave}>
                  <strong>{formatearCampo(clave)}</strong>: "{antes[clave]}" → "
                  {despues[clave]}"
                </li>
              ))}
            </ul>
          ) : (
            <p>Sin cambios visibles.</p>
          )}
        </div>
      );
    }

    if (accion.includes("Eliminacion") && datos_antes) {
      return (
        <div>
          <h5>Datos eliminados:</h5>
          <ul>
            {Object.entries(antes).map(([k, v]) => (
              <li key={k}>
                <strong>{formatearCampo(k)}:</strong> {v}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (accion.includes("Creación") && datos_despues) {
      return (
        <div>
          <h5>Datos creados:</h5>
          <ul>
            {Object.entries(despues).map(([k, v]) => (
              <li key={k}>
                <strong>{formatearCampo(k)}:</strong> {v}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return <p>No hay detalles disponibles.</p>;
  };

  const totalPaginas = Math.ceil(historial.length / ELEMENTOS_POR_PAGINA);
  const historialPaginado = useMemo(
    () =>
      historial.slice(
        (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
        paginaActual * ELEMENTOS_POR_PAGINA
      ),
    [historial, paginaActual]
  );

  return (
    <div className="historial-container">
      <h2 className="historial-title">Historial de Actividades</h2>
      <div className="historial-filter">
        <label className="filtro-label">Filtrar por tipo:</label>
        <select
          className="filtro-select"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          {TIPOS.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className="historial-loading">Cargando historial...</p>}
      {error && <p className="historial-error">{error}</p>}
      {!loading && historial.length === 0 && (
        <p className="historial-vacio">No hay acciones registradas.</p>
      )}
      <ul className="historial-lista">
        {historialPaginado.map((item) => (
          <li
            key={item._id}
            className="historial-item"
            onClick={() => mostrarCambios(item)}
          >
            <div>
              <p className="historial-accion">{item.accion}</p>
              <p className="historial-info">
                Por <strong>{item.usuario}</strong> el{" "}
                {formatearFecha(item.fecha)}
              </p>
            </div>
            <span className="historial-tipo">{item.tipo}</span>
            {seleccionado?._id === item._id && (
              <div className="historial-detalles">
                <h4>Detalles:</h4>
                {renderCambios(item)}
              </div>
            )}
          </li>
        ))}
      </ul>
      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((p) => p - 1)}
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default Historial;
