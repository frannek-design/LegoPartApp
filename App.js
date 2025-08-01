import React, { useState, useEffect } from 'react';

// De React-applicatie is een zelfstandige component.
export default function App() {
  // We gebruiken state om de categorieën op te slaan nadat ze zijn "opgehaald".
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We gebruiken state om bij te houden welke categorieën zijn uitgevouwen.
  const [expandedCategories, setExpandedCategories] = useState({});

  // Simuleer een API-oproep met realistische data van de LEGO Pick a Brick website.
  useEffect(() => {
    // Simuleer een vertraging van de API-oproep.
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Realistische data die de structuur van hoofd- en subcategorieën nabootst,
        // gebaseerd op de categorieën die op de LEGO website zijn gevonden.
        const mockApiResponse = [
          {
            id: 1,
            name: 'Stenen',
            subcategories: [
              { id: 101, name: 'Stenen, speciaal' },
              { id: 102, name: 'Ronde stenen' },
              { id: 103, name: 'Schuine stenen' },
            ],
          },
          {
            id: 2,
            name: 'Platen',
            subcategories: [
              { id: 201, name: 'Platen, speciaal' },
              { id: 202, name: 'Ronde platen' },
              { id: 203, name: 'Aangepaste platen' },
            ],
          },
          {
            id: 3,
            name: 'Tegels',
            subcategories: [
              { id: 301, name: 'Tegels, speciaal' },
              { id: 302, name: 'Ronde tegels' },
              { id: 303, name: 'Aangepaste tegels' },
            ],
          },
          {
            id: 4,
            name: 'Hellingen',
            subcategories: [
              { id: 401, name: 'Hellingen, speciaal' },
              { id: 402, name: 'Gebogen hellingen' },
              { id: 403, name: 'Omgekeerde hellingen' },
            ],
          },
          {
            id: 5,
            name: 'Technic',
            subcategories: [
              { id: 501, name: 'Technic stenen' },
              { id: 502, name: 'Technic balken' },
              { id: 503, name: 'Technic verbindingsstukken' },
            ],
          },
          {
            id: 6,
            name: 'Dieren & natuur',
            subcategories: [
              { id: 601, name: 'Dieren' },
              { id: 602, name: 'Planten & bomen' },
            ],
          },
          {
            id: 7,
            name: 'Minifiguur onderdelen',
            subcategories: [
              { id: 701, name: 'Hoofd' },
              { id: 702, name: 'Torso' },
              { id: 703, name: 'Benen' },
              { id: 704, name: 'Accessoires' },
            ],
          },
        ];

        // Stel de opgehaalde data in de state in na de gesimuleerde vertraging.
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCategories(mockApiResponse);
      } catch (e) {
        setError("Fout bij het ophalen van de categorieën.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // De lege afhankelijkheidsarray zorgt ervoor dat dit maar één keer wordt uitgevoerd.

  // Functie om de uitvouwstatus van een categorie te togglen.
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Component voor een hoofd- en subcategorie in een inklapbaar item.
  const CategoryItem = ({ category }) => {
    const isExpanded = expandedCategories[category.id];

    return (
      <div className="border-b border-gray-700 py-4 transition-colors duration-200">
        <button
          className="flex justify-between items-center w-full focus:outline-none"
          onClick={() => toggleCategory(category.id)}
        >
          <span className="text-xl font-bold text-gray-100">{category.name}</span>
          {/* Iconen om de uitvouwstatus weer te geven */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* Toon de subcategorieën alleen als de hoofdcategorie is uitgevouwen */}
        {isExpanded && category.subcategories && (
          <ul className="mt-4 space-y-2 pl-4 border-l border-gray-600 ml-2">
            {category.subcategories.map(sub => (
              <li key={sub.id} className="text-gray-300 text-lg transition-colors duration-200 hover:text-gray-100">
                {sub.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-yellow-400">LEGO Onderdelen Categorieën</h1>
        
        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-yellow-400 border-dotted rounded-full animate-spin"></div>
            <span className="ml-4 text-gray-400">Laden...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900 text-red-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {categories.map(category => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
