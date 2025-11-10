import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Brain, Sparkles, Plus, Save, ChevronLeft, ChevronRight, Scroll, DollarSign } from 'lucide-react';
import GuiaDecisaoCompleto from './components/GuiaDecisaoCompleto';

const ReformaDoTemplo = () => {
  const [activeTab, setActiveTab] = useState('rotina');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [routineItems, setRoutineItems] = useState([]);
  const [newRoutine, setNewRoutine] = useState({ hora: '', atividade: '', tipo: 'devocional' });
  const [historicoDatas, setHistoricoDatas] = useState([]);
  const [toast, setToast] = useState(null);

  const [bodyMetrics, setBodyMetrics] = useState({
    energia: 5, qualidadeSono: 5, alimentação: 5, hidratação: 5, frequênciaExercícios: 5,
    cumprimentoRotina: 5, resistênciaFadiga: 5, força: 5, flexibilidade: 5, coordenação: 5,
    percepção: 5, resistênciaExcessos: 5, persistência: 5, capacidadeDizerNão: 5
  });

  const [spiritMetrics, setSpiritMetrics] = useState({
    amor: 5, alegria: 5, paz: 5, paciência: 5, fidelidade: 5, mansidão: 5, bondade: 5, benignidade: 5, domínioPróprio: 5
  });

  const [soulMetrics, setSoulMetrics] = useState({
    alegria: 5, esperança: 5, confiança: 5, serenidade: 5, ansiedade: 5, medo: 5, raiva: 5, tristeza: 5, tédio: 5
  });

  const [decisionData, setDecisionData] = useState({
    description: '',
    valor: '',
    alinhamento: [false, false, false, false],
    mordomia: [false, false, false, false, false],
    generosidade: [false, false, false],
    testemunho: [false, false, false],
    eternidade: [false, false, false],
    anotações: ['', '', '', '', '']
  });

  const [decisoesSalvas, setDecisoesSalvas] = useState([]);

  // === FINANÇAS ===
  const [transacoes, setTransacoes] = useState([]);
  const [novaTransacao, setNovaTransacao] = useState({ nome: '', valor: '', tipo: 'saída' });

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
    carregarHistórico();
    carregarDecisoesSalvas();
    carregarTransacoes();
  }, []);

  const carregarDecisoesSalvas = async () => {
    try {
      const result = await storage.get('decisoes-lista');
      if (result && result.value) setDecisoesSalvas(JSON.parse(result.value));
    } catch (e) {}
  };

  const carregarTransacoes = async () => {
    try {
      const result = await storage.get('transacoes-financeiras');
      if (result && result.value) setTransacoes(JSON.parse(result.value));
    } catch (e) {}
  };

  const carregarHistórico = async () => {
    try {
      const result = await storage.get('historico-datas');
      if (result && result.value) {
        const datas = JSON.parse(result.value);
        if (Array.isArray(datas)) setHistoricoDatas(datas);
      }
    } catch (e) {}
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

      showToast('Progresso salvo!', 'success');
    } catch (e) {
      showToast('Erro ao salvar', 'error');
    }
  };

  const salvarDecisao = async () => {
    if (!decisionData.description.trim()) {
      showToast('Descreva a decisão', 'error');
      return;
    }

    const nova = {
      id: Date.now(),
      data: selectedDate,
      dataHora: new Date().toISOString(),
      ...decisionData
    };

    const lista = [nova, ...decisoesSalvas];
    await storage.set('decisoes-lista', JSON.stringify(lista));
    setDecisoesSalvas(lista);

    setDecisionData({
      description: '',
      valor: '',
      alinhamento: [false, false, false, false],
      mordomia: [false, false, false, false, false],
      generosidade: [false, false, false],
      testemunho: [false, false, false],
      eternidade: [false, false, false],
      anotações: ['', '', '', '', '']
    });

    showToast('Decisão salva!', 'success');
  };

  const adicionarTransacao = async () => {
    if (!novaTransacao.nome || !novaTransacao.valor) {
      showToast('Preencha nome e valor', 'error');
      return;
    }

    const valorNum = parseFloat(novaTransacao.valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) {
      showToast('Valor inválido', 'error');
      return;
    }

    const transacao = {
      id: Date.now(),
      data: new Date().toISOString(),
      ...novaTransacao,
      valor: valorNum
    };

    const lista = [transacao, ...transacoes];
    await storage.set('transacoes-financeiras', JSON.stringify(lista));
    setTransacoes(lista);
    setNovaTransacao({ nome: '', valor: '', tipo: 'saída' });
    showToast('Transação adicionada!', 'success');
  };

  const saldoAtual = transacoes.reduce((acc, t) => {
    return t.tipo === 'entrada' ? acc + t.valor : acc - t.valor;
  }, 0);

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const addRoutineItem = () => {
    if (newRoutine.hora && newRoutine.atividade) {
      const item = { ...newRoutine, id: Date.now(), concluída: false };
      setRoutineItems(prev => [...prev, item].sort((a,b) => a.hora.localeCompare(b.hora)));
      setNewRoutine({ hora: '', atividade: '', tipo: 'devocional' });
    }
  };

  const toggleRoutineItem = (id) => {
    setRoutineItems(prev => prev.map(i => i.id === id ? { ...i, concluída: !i.concluída } : i));
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
    físico: 'bg-green-100 text-green-800',
    trabalho: 'bg-blue-100 text-blue-800',
    estudo: 'bg-yellow-100 text-yellow-800',
    alimentação: 'bg-orange-100 text-orange-800',
    entretenimento: 'bg-pink-100 text-pink-800',
    outro: 'bg-gray-100 text-gray-800'
  };

  const interpretacao = (dec) => {
    const totalSim = Object.values(dec).reduce((acc, v) => acc + (Array.isArray(v) ? v.filter(Boolean).length : 0), 0);
    const totalPerguntas = 20;

    const naoImportante = [
      ...dec.alinhamento.slice(0, 3),
      ...dec.mordomia.slice(0, 4),
      ...dec.eternidade
    ].some(v => !v);

    const poucosSim = totalSim < totalPerguntas * 0.7;

    if (totalSim === 20) return { icon: 'All Yes', text: 'Gasto prudente e pode glorificar a Deus.' };
    if (naoImportante) return { icon: 'Warning', text: 'Qualquer “NÃO” importante → espere, ore e reavalie.' };
    if (poucosSim) return { icon: 'Cross', text: 'Muitos “NÃO” → provável sinal de impulsividade.' };
    return { icon: 'All Yes', text: 'Maioria “SIM” → decisão alinhada com a fé.' };
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
              { id: 'decisao', icon: Scroll, label: 'Decisão' },
              { id: 'decisoes', label: 'Decisões Salvas' },
              { id: 'financas', icon: DollarSign, label: 'Finanças' },
              { id: 'historico', label: 'Histórico' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                {tab.icon && <tab.icon size={20} />} {tab.label}
                {tab.id === 'decisoes' && decisoesSalvas.length > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {decisoesSalvas.length}
                  </span>
                )}
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
                      <input type="checkbox" checked={item.concluída} onChange={() => toggleRoutineItem(item.id)} className="w-5 h-5" />
                      <span className="font-mono text-sm w-16">{item.hora}</span>
                      <span className={item.concluída ? 'line-through text-gray-500 flex-1' : 'flex-1'}>{item.atividade}</span>
                      <span className={'px-2 py-1 rounded text-xs ' + tipoColors[item.tipo]}>{item.tipo}</span>
                      <button onClick={() => removeRoutineItem(item.id)} className="text-red-500 text-sm">Remover</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {['corpo', 'espirito', 'alma'].includes(activeTab) && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {activeTab === 'corpo' ? 'Corpo' : activeTab === 'espirito' ? 'Espírito' : 'Alma'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(activeTab === 'corpo' ? bodyMetrics : activeTab === 'espirito' ? spiritMetrics : soulMetrics).map(([key, value]) => (
                    <div key={key} className="mb-4">
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <span className="text-sm font-bold text-blue-600">{value}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={value}
                        onChange={e => {
                          const setter = activeTab === 'corpo' ? setBodyMetrics : activeTab === 'espirito' ? setSpiritMetrics : setSoulMetrics;
                          const metrics = activeTab === 'corpo' ? bodyMetrics : activeTab === 'espirito' ? spiritMetrics : soulMetrics;
                          setter({...metrics, [key]: +e.target.value});
                        }}
                        className="w-full h-2 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'decisao' && (
              <div>
                <GuiaDecisaoCompleto
                  decisionData={decisionData}
                  setDecisionData={setDecisionData}
                  salvarDecisao={salvarDecisao}
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Valor do Gasto (R$):</label>
                  <input
                    type="text"
                    value={decisionData.valor}
                    onChange={e => setDecisionData({...decisionData, valor: e.target.value})}
                    placeholder="Ex: 150,00"
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'decisoes' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-4">Decisões Salvas ({decisoesSalvas.length})</h2>
                {decisoesSalvas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhuma decisão salva ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {decisoesSalvas.map(dec => {
                      const interp = interpretacao(dec);
                      return (
                        <div key={dec.id} className="bg-white p-5 rounded-lg shadow-md border">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-lg text-gray-800">{dec.description}</p>
                              {dec.valor && <p className="text-sm text-green-600 font-semibold">R$ {dec.valor}</p>}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(dec.dataHora).toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="font-semibold text-green-700">Alinhamento ({dec.alinhamento.filter(Boolean).length}/4)</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {['Oração?', 'Glorifica?', 'Gratidão?', 'Satisfeito em Cristo?'].map((q, i) => (
                                  <li key={i} className={dec.alinhamento[i] ? 'text-green-600' : 'text-red-500'}>
                                    {q} {dec.alinhamento[i] ? 'Yes' : 'No'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-blue-700">Mordomia ({dec.mordomia.filter(Boolean).length}/5)</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {['Provisão?', 'Dízimo?', 'Sem dívida?', 'Prudente?', 'Testemunho?'].map((q, i) => (
                                  <li key={i} className={dec.mordomia[i] ? 'text-green-600' : 'text-red-500'}>
                                    {q} {dec.mordomia[i] ? 'Yes' : 'No'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-purple-700">Generosidade ({dec.generosidade.filter(Boolean).length}/3)</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {['Ajuda?', 'Generoso?', 'Necessidade?'].map((q, i) => (
                                  <li key={i} className={dec.generosidade[i] ? 'text-green-600' : 'text-red-500'}>
                                    {q} {dec.generosidade[i] ? 'Yes' : 'No'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-orange-700">Testemunho ({dec.testemunho.filter(Boolean).length}/3)</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {['Servir?', 'Necessidade?', 'Contentamento?'].map((q, i) => (
                                  <li key={i} className={dec.testemunho[i] ? 'text-green-600' : 'text-red-500'}>
                                    {q} {dec.testemunho[i] ? 'Yes' : 'No'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-yellow-700">Eternidade ({dec.eternidade.filter(Boolean).length}/3)</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {['Valor espiritual?', 'Vergonha?', 'Agradecer?'].map((q, i) => (
                                  <li key={i} className={dec.eternidade[i] ? 'text-green-600' : 'text-red-500'}>
                                    {q} {dec.eternidade[i] ? 'Yes' : 'No'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {dec.anotações.some(a => a.trim()) && (
                            <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                              <p className="font-semibold">Anotações:</p>
                              {dec.anotaÇÕES.filter(a => a.trim()).map((a, i) => (
                                <p key={i} className="mt-1">• {a}</p>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 p-2 bg-blue-50 rounded flex items-center gap-2">
                            <span className="text-xl">{interp.icon}</span>
                            <p className="font-semibold text-sm">{interp.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'financas' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Controle Financeiro</h2>

                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-lg font-bold text-green-700">
                    Saldo Atual: R$ {saldoAtual.toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="Nome (ex: Salário)"
                      value={novaTransacao.nome}
                      onChange={e => setNovaTransacao({...novaTransacao, nome: e.target.value})}
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Valor (ex: 1500,00)"
                      value={novaTransacao.valor}
                      onChange={e => setNovaTransacao({...novaTransacao, valor: e.target.value})}
                      className="px-3 py-2 border rounded"
                    />
                    <select
                      value={novaTransacao.tipo}
                      onChange={e => setNovaTransacao({...novaTransacao, tipo: e.target.value})}
                      className="px-3 py-2 border rounded"
                    >
                      <option value="entrada">Entrada</option>
                      <option value="saída">Saída</option>
                    </select>
                    <button
                      onClick={adicionarTransacao}
                      className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Adicionar
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transacoes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Nenhuma transação registrada.</p>
                  ) : (
                    transacoes.map(t => (
                      <div
                        key={t.id}
                        className={`p-3 rounded-lg flex justify-between items-center ${
                          t.tipo === 'entrada' ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-sm">{t.nome}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(t.data).toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <p className={`font-bold ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'historico' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Histórico</h2>
                {historicoDatas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Nenhum registro</p>
                ) : (
                  <div className="space-y-3">
                    {historicoDatas.map(data => (
                      <ListaHistorico
                        key={data}
                        data={data}
                        setSelectedDate={setSelectedDate}
                        setActiveTab={setActiveTab}
                      />
                    ))}
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

const ListaHistorico = ({ data, setSelectedDate, setActiveTab }) => {
  const [medias, setMedias] = useState({ body: 0, spirit: 0, soul: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const get = (k) => localStorage.getItem(k + '-' + data);
      const [b, s, a] = await Promise.all(['body', 'spirit', 'soul'].map(get));
      
      const calc = (val) => {
        if (!val) return 0;
        try {
          const obj = JSON.parse(val);
          const nums = Object.values(obj).filter(n => typeof n === 'number');
          return nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1) : 0;
        } catch { return 0; }
      };

      setMedias({ body: calc(b), spirit: calc(s), soul: calc(a) });
      setLoading(false);
    };
    load();
  }, [data]);

  return (
    <div
      onClick={() => { setSelectedDate(data); setActiveTab('corpo'); }}
      className="p-4 bg-white border rounded-lg cursor-pointer hover:shadow transition-shadow"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">
          {new Date(data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
        </p>
        {loading ? (
          <p className="text-xs text-gray-400">Carregando...</p>
        ) : (
          <div className="flex gap-3 text-sm font-bold">
            <span className="text-green-600">C: {medias.body}</span>
            <span className="text-purple-600">E: {medias.spirit}</span>
            <span className="text-yellow-600">A: {medias.soul}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReformaDoTemplo;
