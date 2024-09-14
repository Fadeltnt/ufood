import React, { useState, useEffect, useRef } from 'react';
import { SearchResult } from './SearchResult'; // Import du composant SearchResult

export const SearchResultsList = ({ results, onResultClick }) => {
  // Utilisation de useRef pour suivre le conteneur de résultats
  const resultsListRef = useRef(null);

  // Effacer la liste des résultats
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Ajout d'un gestionnaire d'événements pour détecter les clics extérieurs
    const handleClickOutside = (event) => {
      if (resultsListRef.current && !resultsListRef.current.contains(event.target)) {
        setIsVisible(false); // Masque la liste des résultats lorsqu'on clique à l'extérieur
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Met à jour l'état de visibilité en fonction des résultats
  useEffect(() => {
    if (results.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [results]);

  return (
    isVisible && (
      <div className="results-list" ref={resultsListRef}>
        {results.map((result, idx) => (
          <SearchResult
            key={
              result.isResto
                ? `${result.id}-resto-${idx}`
                : `${result.id}-user-${idx}`
            }
            result={result}
            onResultClick={onResultClick}
          />
        ))}
      </div>
    )
  );
};
