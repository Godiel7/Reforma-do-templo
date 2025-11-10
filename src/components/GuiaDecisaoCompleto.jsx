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
      title: 'Alinhamento Espiritual',
      icon: '🕊️',
      items: [
        'Busquei a direção de Deus em oração antes de decidir sobre esse gasto?',
        'Essa decisão glorifica a Deus e reflete um coração submisso a Ele?',
        'Esse gasto expressa gratidão e contentamento, e não ganância ou ansiedade?',
        'Se eu perdesse esse bem amanhã, ainda estaria satisfeito em Cristo?'
      ],
      category: 'alinhamento'
    },
    {
      title: 'Princípios de Mordomia e Provisão',
      icon: '💰',
      items: [
        'Esse gasto mantém a provisão necessária para minha família?',
        'Já separei fielmente o dízimo e as ofertas antes dessa decisão?',
        'Tenho recursos suficientes para isso sem precisar me endividar?',
        'Estou sendo prudente e racional, e não guiado apenas pela emoção?',
        'Se todos os irmãos da igreja gastassem assim, o testemunho cristão seria fortalecido?'
      ],
      category: 'mordomia'
    },
    {
      title: 'Amor ao Próximo e Generosidade',
      icon: '🤝',
      items: [
        'Esse gasto não me impede de ajudar alguém necessitado se Deus abrir essa oportunidade?',
        'Tenho sido generoso recentemente e mantenho meu coração aberto para repartir?',
        'Há alguém próximo com necessidade maior que eu poderia atender antes dessa compra?'
      ],
      category: 'generosidade'
    },
    {
      title: 'Testemunho e Contentamento',
      icon: '⚖️',
      items: [
        'O motivo real desse gasto é servir, e não ostentar ou buscar aprovação?',
        'Estou comprando por real necessidade, e não por comparação com outros?',
        'Essa decisão fortalece meu contentamento em Cristo, e não alimenta minha cobiça?'
      ],
      category: 'testemunho'
    },
    {
      title: 'Eternidade e Propósito',
      icon: '📈',
      items: [
        'Esse gasto tem algum valor espiritual ou contribui, direta ou indiretamente, para o Reino de Deus?',
        'Se Cristo voltasse hoje, eu não me envergonharia dessa escolha?',
        'Posso agradecer a Deus por isso com alegria sincera e consciência tranquila?'
      ],
      category: 'eternidade'
    }
  ];

  // Contar SIMs
  const totalSim = Object.values(decisionData).reduce((acc, arr) => {
    if (Array.isArray(arr)) return acc + arr.filter(Boolean).length;
    return acc;
  }, 0);

  const totalPerguntas = sections.reduce((acc, s) => acc + s.items.length, 0);

  const interpretacao = () => {
    const naoImportante = [
      ...decisionData.alinhamento.slice(0, 3),
      ...decisionData.mordomia.slice(0, 4),
      ...decisionData.eternidade
    ].some(v => !v);

    const poucosSim = totalSim < totalPerguntas * 0.7;

    if (totalSim === totalPerguntas) return { icon: '✅', text: 'Gasto prudente e pode glorificar a Deus.' };
    if (naoImportante) return { icon: '⚠️', text: 'Qualquer “NÃO” importante → espere, ore e reavalie.' };
    if (poucosSim) return { icon: '❌', text: 'Muitos “NÃO” → provável sinal de impulsividade ou falta de propósito.' };
    return { icon: '✅', text: 'Maioria “SIM” → decisão alinhada com a fé.' Km
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2 text-blue-700">
        GUIA DE DECISÃO CRISTÃ SOBRE GASTOS
      </h2>
      <p className="text-xs text-gray-600 mb-4">
        Base: Lucas 12:33–34, 1Tm 6:6–10, Tg 4:13–17, Pv 3:9
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Descreva o gasto/decisão:</label>
        <textarea
          value={decisionData.description}
          onChange={e => setDecisionData({ ...decisionData, description: e.target.value })}
          placeholder="Ex: Comprar um celular novo, sair para jantar..."
          className="w-full p-3 border rounded-lg resize-none h-20 text-sm"
        />
      </div>

      {sections.map((section, secIdx) => (
        <div key={secIdx} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <span>{section.icon}</span> {section.title}
          </h3>
          <div className="space-y-3">
            {section.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <label className="flex items-center gap-2 cursor-pointer flex-1">
                  {decisionData[section.category][idx] ? (
                    <CheckSquare size={18} className="text-green-600" />
                  ) : (
                    <Square size={18} className="text-gray-400" />
                  )}
                  <input
                    type="checkbox"
                    checked={decisionData[section.category][idx]}
                    onChange={() => toggleCheckbox(section.category, idx)}
                    className="hidden"
                  />
                  <span className="text-xs">{item}</span>
                </label>
              </div>
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

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">📊 Interpretação</h3>
        <p className="text-sm flex items-center gap-2">
          <span className="text-xl">{interpretacao().icon}</span>
          <span>{interpretacao().text}</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          {totalSim} de {totalPerguntas} respostas SIM
        </p>
      </div>

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
