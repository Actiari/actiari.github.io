import React, { useState, useEffect } from 'react';

const GeographyFlashcardApp = () => {
  // State for flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [cardStats, setCardStats] = useState({});

  // Initial flashcards
  useEffect(() => {
    const initialFlashcards = [
      // Hazards Definitions
      {
        id: 1,
        question: "What are the three types of plate boundaries?",
        answer: "Convergent, Divergent, and Transform boundaries",
        subtopic: "tectonics",
      },
      {
        id: 2,
        question: "Explain the concept of a seismic gap",
        answer: "A seismic gap is a section of a fault that has not experienced recent seismic activity, but is between areas that have. These gaps often indicate accumulated stress and are potential sites for future earthquakes.",
        subtopic: "earthquake",
      },
      {
        id: 3,
        question: "What factors affect the level of volcanic risk in a region?",
        answer: "Population density, level of development, prediction and monitoring capabilities, education, emergency planning, and volcano type (explosive vs. effusive).",
        subtopic: "volcano",
      },
      {
        id: 4,
        question: "Describe the Park Model of disaster response",
        answer: "The Park Model divides disaster response into four phases: mitigation (preventative measures), preparedness (planning), response (emergency actions), and recovery (rebuilding).",
        subtopic: "management",
      },
      {
        id: 5,
        question: "What causes tropical storms to form?",
        answer: "Tropical storms form over warm ocean waters (>26°C) when warm, moist air rises, creating an area of low pressure that draws in surrounding air. The Coriolis effect causes the storm to spin, and if conditions persist, it can intensify into a tropical storm or hurricane.",
        subtopic: "storms",
      },
      
      // Earthquake Case Studies
      {
        id: 6,
        question: "Describe the key impacts of the 2010 Haiti Earthquake",
        answer: "The Haiti Earthquake (magnitude 7.0) killed over 230,000 people, displaced 1.5 million, and caused $8-14 billion in damage (120% of Haiti's GDP). Poor building standards, shallow focus (13km), and proximity to the capital Port-au-Prince (25km) exacerbated impacts. The country's poor infrastructure and limited resources severely hampered response efforts.",
        subtopic: "case study - earthquake",
      },
      {
        id: 7,
        question: "Compare the responses to the 2011 Japan Earthquake and Tsunami",
        answer: "The Japan Earthquake (magnitude 9.0) and tsunami had immediate response from the Japanese government with well-practiced evacuation procedures. International aid was coordinated effectively. The long-term response included a $235 billion reconstruction fund, improved tsunami defenses, and stricter building codes. The nuclear disaster at Fukushima led to revised nuclear safety globally.",
        subtopic: "case study - earthquake",
      },
      
      // Volcanic Case Studies
      {
        id: 8,
        question: "Outline the impacts of the 2010 Eyjafjallajökull eruption in Iceland",
        answer: "This VEI-4 eruption produced an ash plume up to 9km high that disrupted European air travel for 6 days, affecting 10 million passengers and costing airlines $1.7 billion. Local impacts included flooding from glacial melt (jökulhlaups), evacuation of 800 residents, and damage to agriculture. However, Iceland's monitoring system provided early warnings, and there were no direct fatalities.",
        subtopic: "case study - volcano",
      },
      {
        id: 9,
        question: "Explain why Mount Merapi (Indonesia) is considered one of the most dangerous volcanoes in the world",
        answer: "Mount Merapi is highly active with eruptions every 5-10 years. It's located in densely populated Java (population >130 million) with 3 million people living within 30km. Its explosive pyroclastic flows are deadly (2010 eruption killed 353 people). Cultural and economic factors complicate evacuations as many residents are reluctant to leave their livelihoods and believe in spiritual protection. Despite monitoring systems, the unpredictable nature of eruptions and rapid onset make management challenging.",
        subtopic: "case study - volcano",
      },
      
      // Storm Case Studies
      {
        id: 10,
        question: "Compare the impacts of Hurricane Katrina (2005) and Typhoon Haiyan (2013)",
        answer: "Hurricane Katrina (Category 5): 1,836 deaths, $125 billion damage, primarily affected New Orleans (USA). Key issues included levee failures, delayed evacuation, and poor emergency coordination.\n\nTyphoon Haiyan (Category 5): 6,300 deaths, $2 billion damage, devastated the Philippines, particularly Tacloban. Storm surge of 5-7m caused most fatalities. Impacts were worsened by poor infrastructure, inadequate warnings, and limited evacuation facilities.",
        subtopic: "case study - storms",
      },
      
      // Hazard Management
      {
        id: 11,
        question: "What is the Pressure and Release (PAR) Model?",
        answer: "The PAR Model explains disaster vulnerability as the intersection of physical hazards and socio-economic pressures. Root causes (poverty, limited access to resources), dynamic pressures (population growth, urbanization), and unsafe conditions (fragile physical environment, dangerous locations) create vulnerability that, when combined with hazard events, leads to disasters. The model emphasizes addressing underlying vulnerabilities rather than just hazard responses.",
        subtopic: "management",
      },
      {
        id: 12,
        question: "Outline strategies for managing multi-hazard zones",
        answer: "Multi-hazard zones require integrated strategies: 1) Risk mapping and zoning to identify hazard-prone areas, 2) Building codes that address multiple hazards, 3) Early warning systems for different hazard types, 4) Education and community preparedness for various scenarios, 5) Infrastructure designed to withstand multiple hazards, 6) Insurance schemes that cover various disaster types, and 7) Integrated emergency management plans with clear communication protocols.",
        subtopic: "management",
      },
      
      // Tectonics Theory
      {
        id: 13,
        question: "Explain how the theory of plate tectonics developed over time",
        answer: "The theory evolved from Wegener's Continental Drift (1912) which lacked a mechanism but noted continental fit and fossil evidence. Sea floor spreading (Hess, 1960s) provided the missing mechanism with evidence from magnetic striping and mid-ocean ridges. Vine and Matthews (1963) showed alternating magnetic polarity in ocean floor rocks. Wilson (1965) proposed the Wilson Cycle of ocean basin opening and closing. Modern plate tectonics combines these ideas with advanced seismic monitoring and GPS measurements confirming plate movements of 2-15cm per year.",
        subtopic: "tectonics",
      },
      
      // Climate Change and Hazards
      {
        id: 14,
        question: "How might climate change affect tropical storm patterns?",
        answer: "Climate change is predicted to affect tropical storms in several ways: 1) Increased sea surface temperatures may lead to more intense storms, 2) Rising sea levels will amplify storm surge impacts, 3) Changes in atmospheric circulation may alter storm tracks and potentially expand storm-prone regions, 4) Warmer atmospheres hold more moisture, potentially increasing rainfall intensity, 5) Some research suggests fewer but more powerful storms. The IPCC states there is medium confidence that tropical cyclone intensity will increase, while frequency changes remain uncertain.",
        subtopic: "storms",
      },
      
      // Fire Hazards
      {
        id: 15,
        question: "Describe the causes and impacts of the 2019-2020 Australian bushfires",
        answer: "Causes: Record-breaking temperatures (1.5°C above average), severe drought, strong winds, and human activities. Natural fire regimes were disrupted by climate change and land management practices.\n\nImpacts: Burned 18.6 million hectares, killed 34 people directly, destroyed 5,900 buildings, and killed or displaced nearly 3 billion animals. Air quality in Sydney reached 11 times the 'hazardous' level. Economic costs exceeded $4.4 billion. Long-term ecological consequences include potential extinction of vulnerable species and changes to forest composition.",
        subtopic: "case study - fire",
      }
    ];
    
    setFlashcards(initialFlashcards);
    
    // Initialize card stats
    const initialStats = {};
    initialFlashcards.forEach(card => {
      initialStats[card.id] = {
        timesReviewed: 0,
        timesCorrect: 0,
        lastReviewed: null,
        nextReview: new Date()
      };
    });
    setCardStats(initialStats);
  }, []);

  // Update filtered cards whenever filters change
  useEffect(() => {
    let filtered = [...flashcards];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(card =>
        card.question.toLowerCase().includes(term) ||
        card.answer.toLowerCase().includes(term) ||
        (card.subtopic && card.subtopic.toLowerCase().includes(term))
      );
    }
    
    setFilteredCards(filtered);
    
    // Reset to first card when filters change
    if (filtered.length > 0) {
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  }, [flashcards, searchTerm]);

  // Card navigation
  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Loop back to the beginning
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  // Flip card to show answer
  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
    
    // Update stats when showing answer
    if (!showAnswer) {
      const currentCard = filteredCards[currentCardIndex];
      const updatedStats = {...cardStats};
      updatedStats[currentCard.id] = {
        ...updatedStats[currentCard.id],
        timesReviewed: (updatedStats[currentCard.id].timesReviewed || 0) + 1,
        lastReviewed: new Date()
      };
      setCardStats(updatedStats);
    }
  };

  // Statistics component
  const Statistics = () => {
    // Compile stats
    const totalCards = flashcards.length;
    const reviewedCards = Object.values(cardStats).filter(stat => stat.timesReviewed > 0).length;
    
    // Subtopic breakdown
    const tectonicsCards = flashcards.filter(card => card.subtopic.includes('tectonics')).length;
    const earthquakeCards = flashcards.filter(card => card.subtopic.includes('earthquake')).length;
    const volcanoCards = flashcards.filter(card => card.subtopic.includes('volcano')).length;
    const stormCards = flashcards.filter(card => card.subtopic.includes('storm')).length;
    const managementCards = flashcards.filter(card => card.subtopic.includes('management')).length;
    const caseStudyCards = flashcards.filter(card => card.subtopic.includes('case study')).length;
    const fireCards = flashcards.filter(card => card.subtopic.includes('fire')).length;
    
    return (
      <div className="w-full max-w-lg mx-auto mt-6 p-4 bg-green-50 rounded-lg shadow border-2 border-green-700">
        <h3 className="text-xl font-bold mb-4 text-green-900">Your Study Statistics</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-100 p-3 rounded text-center border border-green-700">
              <div className="text-2xl font-bold text-green-900">{totalCards}</div>
              <div className="text-sm">Total Cards</div>
            </div>
            <div className="bg-green-100 p-3 rounded text-center border border-green-700">
              <div className="text-2xl font-bold text-green-900">{reviewedCards}</div>
              <div className="text-sm">Reviewed</div>
            </div>
          </div>
          
          <h4 className="font-bold mt-4 text-green-900">Subtopic Breakdown</h4>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Tectonics</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(tectonicsCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{tectonicsCards}</span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Earthquakes</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(earthquakeCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{earthquakeCards}</span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Volcanoes</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(volcanoCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{volcanoCards}</span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Tropical Storms</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(stormCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{stormCards}</span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Management</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(managementCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{managementCards}</span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Case Studies</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(caseStudyCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{caseStudyCards}</span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-green-900">Fire Hazards</div>
            <div className="w-1/2 flex items-center">
              <div 
                className="bg-green-600 h-4 rounded"
                style={{width: `${(fireCards/totalCards)*100}%`}}
              ></div>
              <span className="ml-2">{fireCards}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-900">AQA Geography AS Level Revision</h1>
          <p className="text-brown-600">Hazards Topic</p>
        </header>
        
        {/* Controls and Filters */}
        <div className="bg-green-100 rounded-lg shadow p-4 mb-6 border-2 border-green-700">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-green-900">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions, answers, or subtopics..."
              className="w-full p-2 border rounded border-green-700 bg-green-50"
            />
          </div>
          
          <div className="flex justify-between">
            <div className="text-sm text-green-800">
              {filteredCards.length} cards {currentCardIndex + 1 > 0 ? `(Card ${currentCardIndex + 1} of ${filteredCards.length})` : ''}
            </div>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-green-800 hover:text-green-600 font-medium"
            >
              {showStats ? 'Hide Statistics' : 'Show Statistics'}
            </button>
          </div>
        </div>
        
        {showStats && <Statistics />}
        
        {/* Flashcard */}
        {filteredCards.length > 0 ? (
          <div className="w-full max-w-lg mx-auto">
            <div 
              className="bg-green-100 rounded-lg shadow-lg p-6 min-h-64 flex flex-col cursor-pointer border-2 border-green-700"
              onClick={toggleAnswer}
            >
              <div className="flex justify-between text-sm text-green-800 mb-2">
                <div>
                  Subtopic: <span className="font-medium capitalize">{filteredCards[currentCardIndex].subtopic}</span>
                </div>
              </div>
              
              <div className="flex-grow">
                {!showAnswer ? (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-green-900">Question:</h3>
                    <p className="text-lg text-green-900">{filteredCards[currentCardIndex].question}</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-green-900">Answer:</h3>
                    <p className="text-lg text-green-900 whitespace-pre-line">{filteredCards[currentCardIndex].answer}</p>
                  </div>
                )}
              </div>
              
              <div className="text-center text-sm text-green-800 mt-4">
                {!showAnswer ? 'Click to reveal answer' : 'Click card again to hide answer'}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className={`px-4 py-2 rounded ${
                  currentCardIndex === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-800 text-white hover:bg-green-700'
                }`}
              >
                Previous Card
              </button>
              
              <button
                onClick={nextCard}
                className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Next Card
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-green-100 rounded-lg shadow border-2 border-green-700">
            <p className="text-lg text-green-900">No flashcards match your search. Try changing your search criteria.</p>
          </div>
        )}
        
        {/* Exam Tips */}
        <div className="mt-8 bg-green-100 rounded-lg shadow p-4 border-2 border-green-700">
          <h3 className="text-xl font-bold text-green-900 mb-2">AQA Hazards Exam Tips</h3>
          <ul className="list-disc pl-5 space-y-2 text-green-900">
            <li>Remember to use specific case studies with named locations, dates and figures.</li>
            <li>Link physical processes to their impacts on people and the environment.</li>
            <li>Compare contrasting examples (e.g., HICs vs LICs, effective vs poor management).</li>
            <li>Ensure you can draw and annotate diagrams for key processes (plate boundaries, tropical storm formation).</li>
            <li>Use appropriate terminology (convergent/destructive, lithosphere, pyroclastic flows, etc.).</li>
            <li>Structure 9-mark and 20-mark questions with clear introductions, developed points, and evaluative conclusions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeographyFlashcardApp;