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
          <h1 className="text-center mb-4" style={{ color: '#e91e63', fontSize: '3rem', fontWeight: 'bold' }}>
            ✨ Personajes de Star Wars ✨
          </h1>
          <p className="text-center text-secondary mb-4">Descubre el universo galáctico</p>
          <button 
            onClick={loadCharacters} 
            disabled={loading}
            className="w-100 fw-bold py-3"
            style={{
              background: 'linear-gradient(135deg, #e91e63 0%, #ff69b4 100%)',
              border: 'none',
              borderRadius: '25px',
              color: 'white',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Cargando...
              </>
            ) : (
              '🌸 Cargar Personajes'
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
                <span className="input-group-text" style={{ background: '#f0f0f0', border: '2px solid #e91e63' }}>
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Busca por nombre..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ border: '2px solid #e91e63' }}
                />
              </div>
            </div>
          </div>

          {/* Filtro por género */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="input-group input-group-lg">
                <span className="input-group-text" style={{ background: '#f0f0f0', border: '2px solid #ff69b4' }}>
                  👥
                </span>
                <select
                  className="form-select fw-bold"
                  value={filterGender}
                  onChange={(e) => {
                    setFilterGender(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ border: '2px solid #ff69b4' }}
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
              <div className="alert fw-bold text-center" style={{ background: '#fff0f5', border: '2px solid #e91e63', color: '#e91e63' }}>
                � Mostrando {paginatedCharacters.length} de {filteredCharacters.length} personaje(s)
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
                  <div 
                    className="card h-100 shadow-lg"
                    style={{
                      border: '3px solid #e91e63',
                      borderRadius: '20px',
                      background: '#fff5f8',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 30px rgba(233, 30, 99, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'default';
                    }}
                  >
                    <div 
                      className="card-header text-white"
                      style={{
                        background: 'linear-gradient(135deg, #e91e63 0%, #ff69b4 100%)',
                        borderRadius: '17px 17px 0 0',
                        border: 'none'
                      }}
                    >
                      <h5 className="card-title mb-0">{character.name}</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-2">
                        <strong style={{ color: '#e91e63' }}>Género:</strong>
                        <p className="mb-0" style={{ color: '#666' }}>
                          {character.gender === 'n/a' ? 'No especificado' : character.gender}
                        </p>
                      </div>
                      <div className="mb-2">
                        <strong style={{ color: '#e91e63' }}>Año de Nacimiento:</strong>
                        <p className="mb-0" style={{ color: '#666' }}>{character.birth_year}</p>
                      </div>
                      <div className="mb-2">
                        <strong style={{ color: '#e91e63' }}>Altura:</strong>
                        <p className="mb-0" style={{ color: '#666' }}>{character.height} cm</p>
                      </div>
                      <div className="mb-2">
                        <strong style={{ color: '#e91e63' }}>Peso:</strong>
                        <p className="mb-0" style={{ color: '#666' }}>{character.mass} kg</p>
                      </div>
                      <div className="mb-2">
                        <strong style={{ color: '#e91e63' }}>Cabello:</strong>
                        <p className="mb-0" style={{ color: '#666' }}>{character.hair_color}</p>
                      </div>
                      <div>
                        <strong style={{ color: '#e91e63' }}>Ojos:</strong>
                        <p className="mb-0" style={{ color: '#666' }}>{character.eye_color}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row justify-content-center mb-5">
              <div className="col-lg-6">
                <div className="alert text-center py-4" style={{ background: '#fff0f5', border: '2px solid #ff69b4', color: '#e91e63' }}>
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
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        style={{
                          background: currentPage === 1 ? '#f0f0f0' : '#fff5f8',
                          color: '#e91e63',
                          border: '2px solid #e91e63',
                          fontWeight: 'bold'
                        }}
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
                          className="page-link fw-bold"
                          onClick={() => setCurrentPage(page)}
                          style={{
                            background: currentPage === page ? '#e91e63' : '#fff5f8',
                            color: currentPage === page ? 'white' : '#e91e63',
                            border: '2px solid #e91e63'
                          }}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        style={{
                          background: currentPage === totalPages ? '#f0f0f0' : '#fff5f8',
                          color: '#e91e63',
                          border: '2px solid #e91e63',
                          fontWeight: 'bold'
                        }}
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
            <div className="alert text-center py-5" style={{ background: '#fff0f5', border: '2px solid #e91e63', color: '#e91e63' }}>
              <h5>ℹ️ Sin datos</h5>
              <p className="mb-0">Haz clic en el botón para cargar los personajes de Star Wars</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
