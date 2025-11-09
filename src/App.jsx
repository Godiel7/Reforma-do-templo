import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Brain, Sparkles, Plus, Save, ChevronLeft, ChevronRight } from 'lucide-react';

const ReformaDoTemplo = () => {
  const [activeTab, setActiveTab] = useState('rotina');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [routineItems, setRoutineItems] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ hora: '', atividade: '', tipo: 'devocional' });
  const [historicoDatas, setHistoricoDatas] = useState([]);
  const [toast, setToast] = useState(null);

  const [bodyMetrics, setBodyMetrics] = useState({
    energia: 5, qualidadeSono: 5, alimentacao: 5, hidratacao: 5,
    frequenciaExercicios: 5, cumprimentoRotina: 5, resistenciaFadiga: 5,
    forca: 5, flexibilidade: 5, coordenacao: 5, percepcao: 5,
    resistenciaExcessos: 5, persistencia: 5, capacidadeDizerNao: 5
  });

  const [spiritMetrics, setSpiritMetrics] = useState({
    amor: 5, alegria: 5, paz: 5, paciencia: 5, fidelidade: 5,
    mansidao: 5, bondade: 5, benignidade: 5, dominioProprio: 5
  });

  const [soulMetrics, setSoulMetrics] = useState({
    alegria: 5, esperanca: 5, confianca: 5, serenidade: 5,
    ansiedade: 5, medo: 5, raiva: 5, tristeza: 5, tedio: 5
  });

  const storage = {
    async get(key) {
      const item = localStorage.getItem(key);
      return item ? { value: item } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    }
  };

  useEffect(() => {
    loadDataForDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const result = await storage.get('historico-datas');
      if (result && result.value) {
        const datas = JSON.parse(result.value);
        if (Array.isArray(datas)) setHistoricoDatas(datas);
      }
    } catch (e) { }
  };

  const loadDataForDate = async (date) => {
    const load = async (key, setter, fallback) => {
      try {
        const res = await storage.get(key + '-' + date);
        if (res && res.value) setter(JSON.parse(res.value));
        else setter(fallback);
      } catch { setter(fallback) }
    };

    load('routine', setRoutineItems, []);
    load('body', setBodyMetrics, { ...bodyMetrics });
    load('spirit', setSpiritMetrics, { ...spiritMetrics });
    load('soul', setSoulMetrics, { ...soulMetrics });
  };

  const saveData = async () => {
    try {
      await Promise.all([
        storage.set('routine-' + selectedDate, JSON.stringify(routineItems)),
        storage.set('body-' + selectedDate, JSON.stringify(bodyMetrics)),
        storage.set('spirit-' + selectedDate, JSON.stringify(spiritMetrics)),
        storage.set('soul-' + selectedDate, JSON.stringify(soulMetrics))
      ]);

      let datas = [];
      const hist = await storage.get('historico-datas');
      if (hist && hist.value) {
        try { datas = JSON.parse(hist.value); } catch { datas = []; }
      }
      if (!datas.includes(selectedDate)) {
        datas.push(selectedDate);
        datas.sort((a, b) => new Date(b) - new Date(a));
        await storage.set('historico-datas', JSON.stringify(datas));
        setHistoricoDatas(datas);
      }

      showToast('Salvo!', 'success');
    } catch (e) {
      showToast('Erro', 'error');
    }
  };

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const addRoutineItem = () => {
    if (newRoutine.hora && newRoutine.atividade) {
      const item = { ...newRoutine, id: Date.now(), concluida: false };
      setRoutineItems(prev => [...prev, item].sort((a,b) => a.hora.localeCompare(b.hora)));
      setNewRoutine({ hora: '', atividade: '', tipo: 'devocional' });
    }
  };

  const toggleRoutineItem = (id) => {
    setRoutineItems(prev => prev.map(i => i.id === id ? { ...i, concluida: !i.concluida } : i));
  };

  const removeRoutineItem = (id) => {
    setRoutineItems(prev => prev.filter(i => i.id !== id));
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const tipoColors = {
    devocional: 'bg-purple-100 text-purple-800',
    fisico: 'bg-green-100 text-green-800',
    trabalho: 'bg-blue-100 text-blue-800',
    estudo: 'bg-yellow-100 text-yellow-800',
    alimentacao: 'bg-orange-100 text-orange-800',
    entretenimento: 'bg-pink-100 text-pink-800',
    outro: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg z-50 animate-pulse
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 pt-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Reforma do Templo</h1>
          <p className="text-gray-600 italic">Apresenteis o vosso corpo em sacrifício vivo - Romanos 12:1</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft size={24} /></button>
            <div className="text-center flex-1">
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="text-lg font-semibold border-none bg-transparent" />
              <p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight size={24} /></button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'rotina', icon: Calendar, label: 'Rotina' },
              { id: 'corpo', icon: Heart, label: 'Corpo' },
              { id: 'espirito', icon: Sparkles, label: 'Espírito' },
              { id: 'alma', icon: Brain, label: 'Alma' },
              { id: 'historico', label: 'Histórico' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>
                {tab.icon && <tab.icon size={20} />} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'rotina' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Rotina Diária</h2>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input type="time" value={newRoutine.hora} onChange={e => setNewRoutine({...newRoutine, hora: e.target.value})} className="px-3 py-2 border rounded" />
                    <input type="text" placeholder="Atividade" value={newRoutine.atividade} onChange={e => setNewRoutine({...newRoutine, atividade: e.target.value})} className="px-3 py-2 border rounded" />
                    <select value={newRoutine.tipo} onChange={e => setNewRoutine({...newRoutine, tipo: e.target.value})} className="px-3 py-2 border rounded">
                      {Object.keys(tipoColors).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button onClick={addRoutineItem} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"><Plus size={20} />Adicionar</button>
                  </div>
                </div>
                <div className="space-y-2">
                  {routineItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" checked={item.concluida} onChange={() => toggleRoutineItem(item.id)} className="w-5 h-5" />
                      <span className="font-mono text-sm w-16">{item.hora}</span>
                      <span className={item.concluida ? 'line-through text-gray-500 flex-1' : 'flex-1'}>{item.atividade}</span>
                      <span className={'px-2 py-1 rounded text-xs ' + tipoColors[item.tipo]}>{item.tipo}</span>
                      <button onClick={() => removeRoutineItem(item.id)} className="text-red-500 text-sm">Remover</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {['corpo', 'espirito', 'alma'].includes(activeTab) && (
              <MetricasTab
                title={activeTab === 'corpo' ? 'Corpo' : activeTab === 'espirito' ? 'Espírito' : 'Alma'}
                metrics={activeTab === 'corpo' ? bodyMetrics : activeTab === 'espirito' ? spiritMetrics : soulMetrics}
                setMetrics={activeTab === 'corpo' ? setBodyMetrics : activeTab === 'espirito' ? setSpiritMetrics : setSoulMetrics}
              />
            )}

            {activeTab === 'historico' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Histórico</h2>
                {historicoDatas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum registro</p>
                ) : (
                  <div className="space-y-3">
                    {historicoDatas.map(data => <ListaHistorico key={data} data={data} setSelectedDate={setSelectedDate} setActiveTab={setActiveTab} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button onClick={saveData} className="bg-green-600 text-white px-8 py-3 rounded flex items-center gap-2 mx-auto shadow-lg">
          <Save size={20} /> Salvar Progresso
        </button>
      </div>
    </div>
  );
};

const MetricasTab = ({ title, metrics, setMetrics }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
              <span className="text-sm font-bold text-blue-600">{value}</span>
            </div>
            <input type="range" min="1" max="10" value={value} onChange={e => setMetrics({...metrics, [key]: +e.target.value})} className="w-full h-2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

const ListaHistorico = ({ data, setSelectedDate, setActiveTab }) => {
  const [medias, setMedias] = useState({ body: 0, spirit: 0, soul: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const get = (k) => localStorage.getItem(k);
      const [b, s, a] = await Promise.all(['body', 'spirit', 'soul'].map(cat => get(cat + '-' + data)));
      const calc = (val) => {
        if (!val) return 0;
        try {
          const obj = JSON.parse(val);
          const nums = Object.values(obj).filter(n => typeof n === 'number');
          return nums.length ? (nums.reduce((a,b) => a+b, 0) / nums.length).toFixed(1) : 0;
        } catch { return 0; }
      };
      setMedias({ body: calc(b), spirit: calc(s), soul: calc(a) });
      setLoading(false);
    };
    load();
  }, [data]);

  return (
    <div onClick={() => { setSelectedDate(data); setActiveTab('corpo'); }} className="p-4 bg-white border rounded-lg cursor-pointer hover:shadow">
      <div className="flex justify-between items-center">
        <p className="font-semibold">{new Date(data).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
        {loading ? <p className="text-xs text-gray-400">Carregando...</p> : (
          <div className="flex gap-3 text-sm font-bold">
            <span className="text-green-600">{medias.body}</span>
            <span className="text-purple-600">{medias.spirit}</span>
            <span className="text-yellow-600">{medias.soul}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReformaDoTemplo;
