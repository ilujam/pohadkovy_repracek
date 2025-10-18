import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { CheckCircle, Package, Wrench, BookOpen, AlertTriangle, Lightbulb, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import RejnokLogo from './assets/rejnok-logo.svg'


// Data pro Elektrického Rejnoka
const initialData = {
  projectName: "Elektrický Rejnok",
  tagline: "Učíme se elektroniku hravě!",
  chapters: [
    { 
      id: 1, 
      name: "Svítící strom", 
      difficulty: "Snadný", 
      status: "Dokončeno", 
      progress: 100,
      topics: ["Harmonika - tlačítka", "Odpor", "LED diody"],
      components: ["LED", "Rezistory", "Tlačítka"],
      icon: "💡"
    },
    { 
      id: 2, 
      name: "Spínač, tlačítka a potenciometr", 
      difficulty: "Snadný", 
      status: "Rozpracováno", 
      progress: 60,
      topics: ["Potenciometr s tužkou", "Harmonikové tlačítko"],
      components: ["Potenciometr", "Spínače", "Tlačítka"],
      icon: "🔘"
    },
    { 
      id: 3, 
      name: "Cívka", 
      difficulty: "Střední", 
      status: "Naplánováno", 
      progress: 0,
      topics: ["Dynamo", "Izolovaný drát", "Zvonek z papíru", "Elektrické motory"],
      components: ["Cívka", "Magnety", "Izolovaný drát"],
      icon: "🧲"
    },
    { 
      id: 4, 
      name: "Polovodičové součástky", 
      difficulty: "Pokročilý", 
      status: "Naplánováno", 
      progress: 0,
      topics: ["Dioda", "Tranzistor", "RS klopný obvod", "NE555"],
      components: ["Diody", "Tranzistory", "NE555"],
      icon: "🔬"
    },
    { 
      id: 5, 
      name: "Arduino a logické součástky", 
      difficulty: "Pokročilý", 
      status: "Naplánováno", 
      progress: 0,
      topics: ["Napojení na Arduino", "Logické obvody"],
      components: ["Arduino", "Logické součástky"],
      icon: "💻"
    }
  ],
  components: [
    { id: 1, name: "LED dioda červená", quantity: 20, used: 8, category: "Diody", chapter: 1 },
    { id: 2, name: "LED dioda modrá", quantity: 20, used: 5, category: "Diody", chapter: 1 },
    { id: 3, name: "LED dioda zelená", quantity: 20, used: 6, category: "Diody", chapter: 1 },
    { id: 4, name: "Rezistor 220Ω", quantity: 30, used: 12, category: "Rezistory", chapter: 1 },
    { id: 5, name: "Rezistor 1kΩ", quantity: 25, used: 8, category: "Rezistory", chapter: 1 },
    { id: 6, name: "Rezistor 10kΩ", quantity: 20, used: 4, category: "Rezistory", chapter: 4 },
    { id: 7, name: "Harmonikové tlačítko", quantity: 10, used: 7, category: "Spínače", chapter: 1 },
    { id: 8, name: "Standardní tlačítko", quantity: 15, used: 5, category: "Spínače", chapter: 2 },
    { id: 9, name: "Potenciometr 10kΩ", quantity: 8, used: 3, category: "Potenciometry", chapter: 2 },
    { id: 10, name: "Měděná páska 5mm", quantity: 10, used: 6, category: "Vodiče", chapter: 1 },
    { id: 11, name: "Izolovaný drát", quantity: 5, used: 0, category: "Vodiče", chapter: 3 },
    { id: 12, name: "Cívka", quantity: 6, used: 0, category: "Induktory", chapter: 3 },
    { id: 13, name: "Magnet", quantity: 12, used: 0, category: "Magnety", chapter: 3 },
    { id: 14, name: "Tranzistor NPN", quantity: 15, used: 0, category: "Polovodiče", chapter: 4 },
    { id: 15, name: "Dioda 1N4148", quantity: 20, used: 0, category: "Polovodiče", chapter: 4 },
    { id: 16, name: "NE555", quantity: 5, used: 0, category: "Polovodiče", chapter: 4 },
    { id: 17, name: "Kartonová deska A4", quantity: 20, used: 9, category: "Podklad", chapter: 1 },
    { id: 18, name: "Baterie 9V", quantity: 6, used: 3, category: "Zdroje", chapter: 1 }
  ],
  learningGoals: [
    { id: 1, chapter: 1, goal: "Pochopení základního elektrického obvodu", achieved: true },
    { id: 2, chapter: 1, goal: "Práce s LED a odporem", achieved: true },
    { id: 3, chapter: 2, goal: "Ovládání proudu pomocí tlačítek", achieved: true },
    { id: 4, chapter: 2, goal: "Pochopení potenciometru", achieved: false },
    { id: 5, chapter: 3, goal: "Princip elektromagnetismu", achieved: false },
    { id: 6, chapter: 3, goal: "Funkce dynama a motoru", achieved: false },
    { id: 7, chapter: 4, goal: "Polovodičové součástky", achieved: false },
    { id: 8, chapter: 4, goal: "Digitální obvody", achieved: false }
  ]
};

const ElectronicsKitDashboard = () => {
  const [kitData, setKitData] = useState(initialData);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [editMode, setEditMode] = useState({
    chapter: null,
    component: null,
    goal: null
  });
  const [editValues, setEditValues] = useState({});

  // Statistiky kapitol
  const chapterStats = useMemo(() => {
    return {
      completed: kitData.chapters.filter(c => c.status === "Dokončeno").length,
      inProgress: kitData.chapters.filter(c => c.status === "Rozpracováno").length,
      planned: kitData.chapters.filter(c => c.status === "Naplánováno").length,
      total: kitData.chapters.length
    };
  }, [kitData.chapters]);

  // Celkový pokrok
  const overallProgress = useMemo(() => {
    const totalProgress = kitData.chapters.reduce((sum, ch) => sum + ch.progress, 0);
    return Math.round(totalProgress / kitData.chapters.length);
  }, [kitData.chapters]);

  // Využití komponent
  const componentUsage = useMemo(() => {
    const total = kitData.components.reduce((sum, c) => sum + c.quantity, 0);
    const used = kitData.components.reduce((sum, c) => sum + c.used, 0);
    return { total, used, percentage: Math.round((used / total) * 100) };
  }, [kitData.components]);

  // Data pro graf obtížnosti
  const difficultyData = useMemo(() => {
    const counts = { "Snadný": 0, "Střední": 0, "Pokročilý": 0 };
    kitData.chapters.forEach(ch => counts[ch.difficulty]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [kitData.chapters]);

  // Data pokroku podle kapitol
  const progressData = useMemo(() => {
    return kitData.chapters.map(ch => ({
      name: `Kap. ${ch.id}`,
      progress: ch.progress,
      fullName: ch.name
    }));
  }, [kitData.chapters]);

  // Učební cíle
  const achievedGoals = kitData.learningGoals.filter(g => g.achieved).length;
  const totalGoals = kitData.learningGoals.length;

  // Edit handlers
  const startEdit = (type, id) => {
    const item = type === 'chapter' ? kitData.chapters.find(c => c.id === id)
               : type === 'component' ? kitData.components.find(c => c.id === id)
               : kitData.learningGoals.find(g => g.id === id);
    
    setEditMode({ ...editMode, [type]: id });
    setEditValues(item);
  };

  const cancelEdit = () => {
    setEditMode({ chapter: null, component: null, goal: null });
    setEditValues({});
  };

  const saveEdit = (type) => {
    if (type === 'chapter') {
      setKitData({
        ...kitData,
        chapters: kitData.chapters.map(c => c.id === editMode.chapter ? editValues : c)
      });
    } else if (type === 'component') {
      setKitData({
        ...kitData,
        components: kitData.components.map(c => c.id === editMode.component ? editValues : c)
      });
    } else if (type === 'goal') {
      setKitData({
        ...kitData,
        learningGoals: kitData.learningGoals.map(g => g.id === editMode.goal ? editValues : g)
      });
    }
    cancelEdit();
  };

  const deleteItem = (type, id) => {
    if (!confirm('Opravdu chcete smazat tuto položku?')) return;
    
    if (type === 'chapter') {
      setKitData({
        ...kitData,
        chapters: kitData.chapters.filter(c => c.id !== id)
      });
    } else if (type === 'component') {
      setKitData({
        ...kitData,
        components: kitData.components.filter(c => c.id !== id)
      });
    } else if (type === 'goal') {
      setKitData({
        ...kitData,
        learningGoals: kitData.learningGoals.filter(g => g.id !== id)
      });
    }
  };

  const addNewChapter = () => {
    const newId = Math.max(...kitData.chapters.map(c => c.id), 0) + 1;
    setKitData({
      ...kitData,
      chapters: [...kitData.chapters, {
        id: newId,
        name: "Nová kapitola",
        difficulty: "Snadný",
        status: "Naplánováno",
        progress: 0,
        topics: [],
        components: [],
        icon: "📚"
      }]
    });
  };

  const addNewComponent = () => {
    const newId = Math.max(...kitData.components.map(c => c.id), 0) + 1;
    setKitData({
      ...kitData,
      components: [...kitData.components, {
        id: newId,
        name: "Nová komponenta",
        quantity: 0,
        used: 0,
        category: "Ostatní",
        chapter: 1
      }]
    });
  };

  const addNewGoal = () => {
    const newId = Math.max(...kitData.learningGoals.map(g => g.id), 0) + 1;
    setKitData({
      ...kitData,
      learningGoals: [...kitData.learningGoals, {
        id: newId,
        chapter: 1,
        goal: "Nový cíl",
        achieved: false
      }]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 p-8">
      {/* Hlavička s rejnokem */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
        {/* SVG Rejnok v pozadí */}
        <div className="relative z-10">
        {/* Logo + text pod sebou, centrované */}
        <div className="flex flex-col items-center text-center relative mb-0 pt-0">
          <div className="flex justify-center items-center">
            <img
              src={RejnokLogo}
              alt="Rejnok Logo"
              className="h-72 md:h-96 w-auto mb-5 -mt-9 block"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-none m-0 -mt-40">
            {kitData.projectName}
          </h1>
          <p className="text-cyan-100 text-lg md:text-xl mt-2 leading-tight">
            {kitData.tagline}
          </p>
        </div>

      </div>


      {/* Info karty ve 4 sloupcích */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-3">
          <div className="text-2xl font-bold">{chapterStats.total}</div>
          <div className="text-sm text-cyan-100">Kapitol celkem</div>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-lg p-3">
          <div className="text-2xl font-bold">{overallProgress}%</div>
          <div className="text-sm text-cyan-100">Celkový pokrok</div>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-lg p-3">
          <div className="text-2xl font-bold">{componentUsage.used}/{componentUsage.total}</div>
          <div className="text-sm text-cyan-100">Použité komponenty</div>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-lg p-3">
          <div className="text-2xl font-bold">{achievedGoals}/{totalGoals}</div>
          <div className="text-sm text-cyan-100">Splněné cíle</div>
          </div>
        </div>
      </div>


      {/* Kapitoly */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            Kapitoly a projekty
          </h2>
          <button
            onClick={addNewChapter}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Přidat kapitolu
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kitData.chapters.map(chapter => (
            <div 
              key={chapter.id}
              className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                selectedChapter === chapter.id ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-200'
              }`}
            >
              {editMode.chapter === chapter.id ? (
                // Edit mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Název kapitoly"
                  />
                  <select
                    value={editValues.difficulty}
                    onChange={(e) => setEditValues({...editValues, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Snadný">Snadný</option>
                    <option value="Střední">Střední</option>
                    <option value="Pokročilý">Pokročilý</option>
                  </select>
                  <select
                    value={editValues.status}
                    onChange={(e) => setEditValues({...editValues, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Naplánováno">Naplánováno</option>
                    <option value="Rozpracováno">Rozpracováno</option>
                    <option value="Dokončeno">Dokončeno</option>
                  </select>
                  <input
                    type="number"
                    value={editValues.progress}
                    onChange={(e) => setEditValues({...editValues, progress: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Pokrok (%)"
                    min="0"
                    max="100"
                  />
                  <input
                    type="text"
                    value={editValues.icon}
                    onChange={(e) => setEditValues({...editValues, icon: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ikona (emoji)"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit('chapter')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Uložit
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                      Zrušit
                    </button>
                  </div>
                </div>
              ) : (
                // View mode
                <>
                  <div onClick={() => setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-4xl mr-3">{chapter.icon}</span>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">Kapitola {chapter.id}</h3>
                          <p className="text-sm text-gray-600">{chapter.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Pokrok</span>
                        <span className="font-semibold text-gray-800">{chapter.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            chapter.progress === 100 ? 'bg-green-500' :
                            chapter.progress > 0 ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                          style={{width: `${chapter.progress}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        chapter.difficulty === 'Snadný' ? 'bg-green-100 text-green-800' :
                        chapter.difficulty === 'Střední' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {chapter.difficulty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        chapter.status === 'Dokončeno' ? 'bg-green-100 text-green-800' :
                        chapter.status === 'Rozpracováno' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {chapter.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button
                      onClick={() => startEdit('chapter', chapter.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                      Upravit
                    </button>
                    <button
                      onClick={() => deleteItem('chapter', chapter.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grafy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pokrok podle kapitol</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold">{payload[0].payload.fullName}</p>
                      <p className="text-blue-600">{payload[0].value}% dokončeno</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Bar dataKey="progress" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Obtížnost kapitol</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, value}) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#22c55e" />
                <Cell fill="#f59e0b" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Komponenty */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-purple-600" />
            Inventář komponent
          </h2>
          <button
            onClick={addNewComponent}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Přidat komponentu
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700">Komponenta</th>
                <th className="text-left py-3 px-4 text-gray-700">Kategorie</th>
                <th className="text-center py-3 px-4 text-gray-700">Celkem</th>
                <th className="text-center py-3 px-4 text-gray-700">Použito</th>
                <th className="text-center py-3 px-4 text-gray-700">Zbývá</th>
                <th className="text-center py-3 px-4 text-gray-700">Akce</th>
              </tr>
            </thead>
            <tbody>
              {kitData.components.map(comp => (
                <tr key={comp.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {editMode.component === comp.id ? (
                    <>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) => setEditValues({...editValues, name: e.target.value})}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={editValues.category}
                          onChange={(e) => setEditValues({...editValues, category: e.target.value})}
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editValues.quantity}
                          onChange={(e) => setEditValues({...editValues, quantity: parseInt(e.target.value) || 0})}
                          className="w-20 px-2 py-1 border rounded text-center"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={editValues.used}
                          onChange={(e) => setEditValues({...editValues, used: parseInt(e.target.value) || 0})}
                          className="w-20 px-2 py-1 border rounded text-center"
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-800">
                        {editValues.quantity - editValues.used}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => saveEdit('component')}
                            className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4 font-medium text-gray-800">{comp.name}</td>
                      <td className="py-3 px-4 text-gray-600">{comp.category}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{comp.quantity}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{comp.used}</td>
                      <td className="py-3 px-4 text-center font-semibold text-gray-800">{comp.quantity - comp.used}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => startEdit('component', comp.id)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteItem('component', comp.id)}
                            className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Učební cíle */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
            Učební cíle
          </h2>
          <button
            onClick={addNewGoal}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Přidat cíl
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kitData.learningGoals.map((goal) => (
            <div key={goal.id} className={`flex items-start p-3 rounded-lg border-2 ${
              goal.achieved ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              {editMode.goal === goal.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editValues.goal}
                    onChange={(e) => setEditValues({...editValues, goal: e.target.value})}
                    className="w-full px-2 py-1 border rounded"
                  />
                  <select
                    value={editValues.chapter}
                    onChange={(e) => setEditValues({...editValues, chapter: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border rounded"
                  >
                    {kitData.chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>Kapitola {ch.id}</option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editValues.achieved}
                      onChange={(e) => setEditValues({...editValues, achieved: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Splněno</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit('goal')}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Uložit
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                      Zrušit
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mr-3 mt-1">
                    {goal.achieved ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${goal.achieved ? 'text-green-800' : 'text-gray-700'}`}>
                      {goal.goal}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Kapitola {goal.chapter}</p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => startEdit('goal', goal.id)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteItem('goal', goal.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElectronicsKitDashboard;