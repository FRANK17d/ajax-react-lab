import { useState } from 'react';
import axios from 'axios';

export default function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const loadCharacters = () => {
    setLoading(true);
    setSearchTerm('');
    setFilterGender('');
    setCurrentPage(1);

    // Cargar todas las páginas de personajes
    let allCharacters = [];
    let nextUrl = 'https://swapi.dev/api/people/';

    const fetchAllPages = () => {
      axios
        .get(nextUrl)
        .then((response) => {
          allCharacters = [...allCharacters, ...response.data.results];
          
          // Si hay más páginas, continuar cargando
          if (response.data.next) {
            nextUrl = response.data.next;
            fetchAllPages();
          } else {
            // Cuando terminamos de cargar todas las páginas
            setCharacters(allCharacters);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    };

    fetchAllPages();
  };

  // Filtrar caracteres por búsqueda y género, luego ordenar alfabéticamente
  const filteredCharacters = characters
    .filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((character) =>
      filterGender === '' || character.gender === filterGender
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calcular paginación
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCharacters = filteredCharacters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Obtener géneros únicos para el filtro
  const uniqueGenders = [...new Set(characters.map((c) => c.gender))].sort();

  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
          <h1 className="text-center text-warning mb-4">⭐ Personajes de Star Wars</h1>
          <button 
            onClick={loadCharacters} 
            disabled={loading}
            className="btn btn-warning btn-lg w-100 fw-bold"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando Personajes...
              </>
            ) : (
              '🚀 Cargar Personajes'
            )}
          </button>
        </div>
      </div>

      {characters.length > 0 && (
        <>
          {/* Búsqueda por nombre */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-warning text-dark fw-bold border-0">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-warning"
                  placeholder="Busca por nombre..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Filtro por género */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-info text-dark fw-bold border-0">
                  👥
                </span>
                <select
                  className="form-select bg-dark text-light border-info fw-bold"
                  value={filterGender}
                  onChange={(e) => {
                    setFilterGender(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Todos los géneros</option>
                  {uniqueGenders.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender === 'n/a' ? 'No especificado' : gender}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="alert alert-primary text-dark fw-bold">
                📊 Mostrando {paginatedCharacters.length} de {filteredCharacters.length} personaje(s)
                {searchTerm && ` que coinciden con "${searchTerm}"`}
                {filterGender && ` • Género: ${filterGender === 'n/a' ? 'No especificado' : filterGender}`}
              </div>
            </div>
          </div>

          {/* Tarjetas de personajes */}
          {paginatedCharacters.length > 0 ? (
            <div className="row g-4 mb-5">
              {paginatedCharacters.map((character, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card h-100 border-warning bg-dark text-light shadow-lg transition-all">
                    <div className="card-header bg-warning text-dark">
                      <h5 className="card-title mb-0">{character.name}</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong className="text-warning">Género:</strong>
                        <p className="mb-0 text-secondary">
                          {character.gender === 'n/a' ? 'No especificado' : character.gender}
                        </p>
                      </div>
                      <div className="mb-2">
                        <strong className="text-warning">Año de Nacimiento:</strong>
                        <p className="mb-0 text-secondary">{character.birth_year}</p>
                      </div>
                      <div className="mb-2">
                        <strong className="text-warning">Altura:</strong>
                        <p className="mb-0 text-secondary">{character.height} cm</p>
                      </div>
                      <div className="mb-2">
                        <strong className="text-warning">Peso:</strong>
                        <p className="mb-0 text-secondary">{character.mass} kg</p>
                      </div>
                      <div className="mb-2">
                        <strong className="text-warning">Cabello:</strong>
                        <p className="mb-0 text-secondary">{character.hair_color}</p>
                      </div>
                      <div>
                        <strong className="text-warning">Ojos:</strong>
                        <p className="mb-0 text-secondary">{character.eye_color}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row justify-content-center mb-5">
              <div className="col-lg-6">
                <div className="alert alert-warning text-center py-4" role="alert">
                  <h5>❌ Sin resultados</h5>
                  <p className="mb-0">No encontramos personajes con los filtros aplicados</p>
                </div>
              </div>
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link bg-dark text-warning border-warning"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        ← Anterior
                      </button>
                    </li>

                    {/* Números de página */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button
                          className={`page-link fw-bold ${
                            currentPage === page
                              ? 'bg-warning text-dark border-warning'
                              : 'bg-dark text-warning border-warning'
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link bg-dark text-warning border-warning"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente →
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && characters.length === 0 && (
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="alert alert-info text-center py-5" role="alert">
              <h5>ℹ️ Sin datos</h5>
              <p className="mb-0">Haz clic en el botón para cargar los personajes de Star Wars</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
