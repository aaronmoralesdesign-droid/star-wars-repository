import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { fetchResourceDetail, getEntityImageUrl, getIdFromUrl } from "../services/swapi";

const LABEL_BLACKLIST = ["created", "edited", "url", "name"];
const formatLabel = (key) => key.replaceAll("_", " ").replace(/\b\w/g, (chr) => chr.toUpperCase());

export const Single = () => {
  const { category, id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResource = async () => {
      try {
        const data = await fetchResourceDetail(category, id);
        setResource(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadResource();
  }, [category, id]);

  const favorite = store.favorites.find(
    (item) => item.category === category && item.id === id
  );

  const toggleFavorite = () => {
    if (!resource) return;

    if (favorite) {
      dispatch({ type: "remove_favorite", payload: { category, id } });
      return;
    }

    dispatch({
      type: "add_favorite",
      payload: {
        id,
        category,
        name: resource.properties.name,
        url: resource.properties.url,
      },
    });
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="alert alert-info">Cargando detalle...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    );
  }

  const properties = resource?.properties || {};

  const detailFields = (() => {
    if (category === "planets") {
      return [
        ["name", properties.name],
        ["climate", properties.climate],
        ["population", properties.population],
        ["orbital_period", properties.orbital_period],
        ["rotation_period", properties.rotation_period],
        ["diameter", properties.diameter],
      ];
    }

    if (category === "vehicles") {
      return Object.entries(properties)
        .filter(([key]) => !["created", "edited", "url", "name", "uid", "__v"].includes(key))
        .map(([key, value]) => [key, Array.isArray(value) ? value.join(", ") : value]);
    }

    return [
      ["name", properties.name],
      ["birth_year", properties.birth_year],
      ["gender", properties.gender],
      ["height", properties.height],
      ["skin_color", properties.skin_color],
      ["eye_color", properties.eye_color],
    ];
  })().filter(([, value]) => value !== undefined && value !== null && value !== "");

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="display-6">{properties.name}</h1>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-outline-secondary" to="/">
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm h-100">
            <img
              src={getEntityImageUrl(category, id)}
              className="card-img-top"
              alt={properties.name}
              onError={(e) => {
                e.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
              }}
            />
            <div className="card-body">
              <button
                className={`btn w-100 ${favorite ? "btn-danger" : "btn-warning"}`}
                onClick={toggleFavorite}
              >
                {favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Información</h5>
              <div className="row gy-3 mt-3">
                {detailFields.map(([key, value]) => (
                  <div className="col-12 col-md-6" key={key}>
                    <strong>{formatLabel(key)}:</strong>
                    <div>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <p className="card-text text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </div>
  );
};
