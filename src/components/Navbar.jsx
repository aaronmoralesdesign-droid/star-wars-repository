import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const favoritesCount = store.favorites?.length ?? 0;

  const removeFavorite = (event, item) => {
    event.preventDefault();
    event.stopPropagation();
    dispatch({ type: "remove_favorite", payload: { category: item.category, id: item.id } });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="https://www.clipartmax.com/png/full/125-1256436_star-wars-white-logo-png.png"
            alt="Logo"
            width="100"
            height="50"
            className="d-inline-block align-text-top"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link text-decoration-none text-light"
                id="favoritesDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                type="button"
              >
                Favoritos
                <span className="badge bg-warning text-dark ms-2">{favoritesCount}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="favoritesDropdown">
                {favoritesCount === 0 ? (
                  <li>
                    <span className="dropdown-item-text text-muted">No hay favoritos aún</span>
                  </li>
                ) : (
                  store.favorites.map((item) => (
                    <li key={`${item.category}-${item.id}`}>
                      <div className="dropdown-item d-flex justify-content-between align-items-center gap-2">
                        <Link className="flex-grow-1 text-decoration-none text-dark" to={`/single/${item.category}/${item.id}`}>
                          <span>{item.name}</span>
                          <span className="badge bg-secondary text-white ms-2">{item.category}</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={(event) => removeFavorite(event, item)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};