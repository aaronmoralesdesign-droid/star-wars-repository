import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const getEntityImageUrl = (category, id) => {
  const base = "https://starwars-visualguide.com/assets/img";
  if (category === "people") return `${base}/characters/${id}.jpg`;
  if (category === "planets") return `${base}/planets/${id}.jpg`;
  if (category === "vehicles") return `${base}/vehicles/${id}.jpg`;
  return `${base}/placeholder.jpg`;
};

export const Favorites = () => {
  const { store, dispatch } = useGlobalReducer();

  const removeFavorite = (favorite) => {
    dispatch({
      type: "remove_favorite",
      payload: { category: favorite.category, id: favorite.id },
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-4">
        <div>
          <h1 className="display-6">Lista de lectura</h1>
          <p className="text-muted">Estos son tus favoritos guardados para leer después.</p>
        </div>
        <Link className="btn btn-outline-primary mt-3 mt-md-0" to="/">
          Volver al listado principal
        </Link>
      </div>

      {store.favorites.length === 0 ? (
        <div className="alert alert-warning">Aún no tienes favoritos. Explora personajes, planetas o vehículos para guardarlos.</div>
      ) : (
        <div className="row gy-4">
          {store.favorites.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={`${item.category}-${item.id}`}>
              <div className="card h-100 shadow-sm">
                <img
                  src={getEntityImageUrl(item.category, item.id)}
                  className="card-img-top"
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-capitalize">{item.name}</h5>
                  <p className="card-text text-secondary mb-3">{item.category}</p>
                  <div className="mt-auto">
                    <Link className="btn btn-sm btn-primary me-2" to={`/single/${item.category}/${item.id}`}>
                      Ver detalle
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeFavorite(item)}>
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
