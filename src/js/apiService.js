function apiService(searchQuery) {
  return (
    fetch(searchQuery)
      .then(response => response.json())
      .then(obj => obj.hits)
      .catch(error => console.log('ERROR!!!'))
  );
}

export default apiService;
