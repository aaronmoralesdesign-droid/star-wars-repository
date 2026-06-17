export const initialStore = () => {
  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    favorites: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'add_task': {
      const { id, color } = action.payload
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    }
    case 'add_favorite': {
      const favorite = action.payload;
      const exists = store.favorites.some(
        (item) => item.category === favorite.category && item.id === favorite.id
      );
      if (exists) return store;

      return {
        ...store,
        favorites: [...store.favorites, favorite]
      };
    }
    case 'remove_favorite': {
      const { category, id } = action.payload;
      return {
        ...store,
        favorites: store.favorites.filter(
          (item) => item.category !== category || item.id !== id
        )
      };
    }
    default:
      throw Error('Unknown action.');
  }    
}
