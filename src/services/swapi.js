const API_BASE = "https://www.swapi.tech/api";
const cache = new Map();
const REQUEST_DELAY = 100; // Delay en ms entre solicitudes

export const getIdFromUrl = (url) => {
  const match = url?.match(/\/api\/[a-z]+\/(\d+)\/?$/);
  return match ? match[1] : null;
};

export const getEntityImageUrl = (category, id) => {
  const base = "https://starwars-visualguide.com/assets/img";
  if (category === "people") return `${base}/characters/${id}.jpg`;
  if (category === "planets") return `${base}/planets/${id}.jpg`;
  if (category === "vehicles") return `${base}/vehicles/${id}.jpg`;
  return `${base}/placeholder.jpg`;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (url) => {
  // Verificar cache
  if (cache.has(url)) {
    return cache.get(url);
  }

  await delay(REQUEST_DELAY);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SWAPI request failed: ${response.status}`);
  }
  const data = await response.json();
  cache.set(url, data);
  return data;
};

export const fetchResourceList = async (resource, page = 1, limit = 8) => {
  const url = `${API_BASE}/${resource}?page=${page}&limit=${limit}`;
  const data = await fetchJson(url);
  return data.results.map((item) => ({
    ...item,
    id: getIdFromUrl(item.url),
    category: resource,
  }));
};

export const fetchResourceDetail = async (category, id) => {
  const url = `${API_BASE}/${category}/${id}`;
  const data = await fetchJson(url);
  return data.result;
};

export const fetchResourceListWithDetails = async (resource, page = 1, limit = 8) => {
  const list = await fetchResourceList(resource, page, limit);
  const detailed = [];
  
  // Cargar detalles secuencialmente para evitar rate limiting
  for (const item of list) {
    try {
      const result = await fetchResourceDetail(resource, item.id);
      detailed.push({
        ...item,
        properties: result.properties,
      });
    } catch (err) {
      // Si falla un item, lo incluimos sin detalles
      detailed.push(item);
    }
  }
  
  return detailed;
};
