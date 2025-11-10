import React from 'react';
import { CheckSquare, Square, Scroll, Save } from 'lucide-react';

const GuiaDecisaoCompleto = ({ decisionData, setDecisionData, salvarDecisao }) => {
  const toggleCheckbox = (category, index) => {
    const updated = [...decisionData[category]];
    updated[index] = !updated[index];
    setDecisionData({ ...decisionData, [category]: updated });
  };

  const updateAnotacao = (index, value) => {
    const updated = [...decisionData.anotações];
    updated[index] = value;
    setDecisionData({ ...decisionData, anotações: updated });
  };

  const sections = [
    {
      title: 'Alinhamento com a Vontade de Deus',
      items: [
        'Está de acordo com a Bíblia?',
        'Edifica minha fé?',
        'Me aproxima de Deus?',
        'Glorifica a Deus?'
      ],
      category: 'alinhamento'
    },
    {
      title: 'Mordomia do Corpo',
      items: [
        'Afeta minha saúde física?',
        'Afeta meu sono?',
        'Afeta minha energia?',
        'Afeta minha aparência?',
        'Afeta minha disciplina?'
      ],
      category: 'mordomia'
    },
    {
      title: 'Generosidade e Finanças',
      items: [
        'Gasto dinheiro com isso?',
        'Poderia usar esse recurso para o Reino?',
        'É um bom investimento eterno?'
      ],
      category: 'generosidade'
    },
    {
      title: 'Testemunho e Relacionamentos',
      items: [
        'Meus irmãos em Cristo aprovariam?',
        'Minha família aprovaria?',
        'Dá bom testemunho?'
      ],
      category: 'testemunho'
    },
    {
      title: 'Foco na Eternidade',
      items: [
        'Vale a pena no céu?',
        'Me distrai do essencial?',
        'Me ajuda a crescer espiritualmente?'
      ],
      category: 'eternidade'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Scroll size={28} className="text-blue-600" />
        Guia de Decisão Cristã
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Descreva a decisão:</label>
        <textarea
          value={decisionData.description}
          onChange={e => setDecisionData({ ...decisionData, description: e.target.value })}
          placeholder="Ex: Comprar um celular novo..."
          className="w-full p-3 border rounded-lg resize-none h-24"
        />
      </div>

      {sections.map((section, secIdx) => (
        <div key={secIdx} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">{section.title}</h3>
          <div className="space-y-2">
            {section.items.map((item, idx) => (
              <label key={idx} className="flex items-center gap-3 cursive-pointer select-none">
                {decisionData[section.category][idx] ? (
                  <CheckSquare size={20} className="text-green-600" />
                ) : (
                  <Square size={18} className="text-gray-400" />
                )}
                <input
                  type="checkbox"
                  checked={decisionData[section.category][idx]}
                  onChange={() => toggleCheckbox(section.category, idx)}
                  className="hidden"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
          {secIdx < sections.length - 1 && (
            <div className="mt-3">
              <textarea
                value={decisionData.anotações[secIdx]}
                onChange={e => updateAnotacao(secIdx, e.target.value)}
                placeholder="Anotações sobre esta seção..."
                className="w-full p-2 text-xs border rounded resize-none h-16"
              />
            </div>
          )}
        </div>
      ))}

      <button
        onClick={salvarDecisao}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
      >
        <Save size={20} />
        Salvar Decisão
      </button>
    </div>
  );
};

export default GuiaDecisaoCompleto;
