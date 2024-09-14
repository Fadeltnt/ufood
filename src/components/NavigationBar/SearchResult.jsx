export const SearchResult = ({ result, onResultClick }) => {
  return (
    <div className='search-result' onClick={() => onResultClick(result)}>
      <div>{result.name}</div> {/* Affichage du nom du restaurant */}
      <div>{result.address}</div> {/* Affichage de l'adresse du restaurant */}
    </div>
  )
}
