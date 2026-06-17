import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { fetchResourceListWithDetails, getEntityImageUrl } from "../services/swapi";

const categories = [
  { resource: "people", label: "Personajes" },
  { resource: "planets", label: "Planetas" },
  { resource: "vehicles", label: "Vehículos" },
];

const getPreviewFields = (item) => {
  const properties = item.properties || {};
  if (item.category === "people") {
    return {
      labelA: "Gender",
      valueA: properties.gender || "—",
      labelB: "Hair Color",
      valueB: properties.hair_color || "—",
      labelC: "Eye Color",
      valueC: properties.eye_color || "—",
    };
  }

  if (item.category === "planets") {
    return {
      labelA: "Population",
      valueA: properties.population || "—",
      labelB: "Terrain",
      valueB: properties.terrain || "—",
      labelC: "Climate",
      valueC: properties.climate || "—",
    };
  }

  if (item.category === "vehicles") {
    return {
      labelA: "Model",
      valueA: properties.model || "—",
      labelB: "Manufacturer",
      valueB: properties.manufacturer || "—",
      labelC: "Class",
      valueC: properties.vehicle_class || "—",
    };
  }

  return {
    labelA: "Info",
    valueA: "—",
    labelB: "Info",
    valueB: "—",
    labelC: "Info",
    valueC: "—",
  };
};

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const [data, setData] = useState({ people: [], planets: [], vehicles: [] });
  const [loading, setLoading] = useState({ people: true, planets: true, vehicles: true });
  const [error, setError] = useState({ people: null, planets: null, vehicles: null });

  const loadCategory = async (resource) => {
    setLoading((prev) => ({ ...prev, [resource]: true }));
    setError((prev) => ({ ...prev, [resource]: null }));
    try {
      const items = await fetchResourceListWithDetails(resource, 1, 8);
      setData((prev) => ({ ...prev, [resource]: items }));
    } catch (err) {
      setError((prev) => ({ ...prev, [resource]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [resource]: false }));
    }
  };

  useEffect(() => {
    categories.forEach((section) => loadCategory(section.resource));
  }, []);

  const addFavorite = (item) => {
    dispatch({ type: "add_favorite", payload: item });
  };

  const isFavorite = (item) =>
    store.favorites.some(
      (favorite) => favorite.category === item.category && favorite.id === item.id
    );

  return (
    <div className="container py-4">
      {categories.map((section) => (
        <section className="mb-5" key={section.resource}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3 gap-3">
            <div>
              <h2 className="h4 mb-1"><strong>{section.label}</strong></h2>
              <p className="text-muted mb-0">Desliza para ver más elementos en {section.label}.</p>
            </div>
          </div>

          {loading[section.resource] ? (
            <div className="alert alert-info">Cargando {section.label}...</div>
          ) : error[section.resource] ? (
            <div className="alert alert-danger">Error: {error[section.resource]}</div>
          ) : (
            <div className="row flex-row flex-nowrap overflow-auto gx-3 gy-4 pb-2">
              {data[section.resource].map((item) => {
                const preview = getPreviewFields(item);
                return (
                  <div className="col-12 col-md-8 col-lg-6 col-xl-4 flex-shrink-0" key={item.id} style={{ minWidth: 320 }}>
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
                        <h5 className="card-title">{item.name}</h5>
                        <ul className="list-group list-group-flush mb-3">
                          <li className="list-group-item py-2 px-0 d-flex justify-content-between">
                            <span className="text-muted">{preview.labelA}</span>
                            <span>{preview.valueA}</span>
                          </li>
                          <li className="list-group-item py-2 px-0 d-flex justify-content-between">
                            <span className="text-muted">{preview.labelB}</span>
                            <span>{preview.valueB}</span>
                          </li>
                          <li className="list-group-item py-2 px-0 d-flex justify-content-between">
                            <span className="text-muted">{preview.labelC}</span>
                            <span>{preview.valueC}</span>
                          </li>
                        </ul>
                        <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                          <Link className="btn btn-primary btn-sm" to={`/single/${item.category}/${item.id}`}>
                            Ver detalle
                          </Link>
                          <button
                            className={`btn btn-outline-warning btn-sm d-flex align-items-center justify-content-center ${isFavorite(item) ? "text-danger" : ""}`}
                            onClick={() => addFavorite(item)}
                            title={isFavorite(item) ? "Guardado" : "Guardar en favoritos"}
                          >
                            <i className={`fa${isFavorite(item) ? "s" : "r"} fa-heart`}></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
