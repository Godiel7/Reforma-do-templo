import React from 'react';
import { Save } from 'lucide-react';

const GuiaDecisao = ({ decisionData, setDecisionData, salvarDecisao }) => {
  const sections = [
    {
      title: "1. Alinhamento espiritual",
      verse: "1Co 10:31",
      questions: [
        "Busquei a direção de Deus em oração antes de decidir sobre esse gasto?",
        "Essa decisão glorifica a Deus e reflete um coração submisso a Ele?",
        "Esse gasto expressa gratidão e contentamento, e não ganância ou ansiedade?",
        "Se eu perdesse esse bem amanhã, ainda estaria satisfeito em Cristo?"
      ]
    },
    {
      title: "2. Princípios de mordomia e provisão",
      verse: "Pv 3:9",
      questions: [
        "Esse gasto mantém a provisão necessária para minha família?",
        "Já separei fielmente o dízimo e as ofertas antes dessa decisão?",
        "Tenho recursos suficientes para isso sem precisar me endividar?",
        "Estou sendo prudente e racional, e não guiado apenas pela emoção?",
        "Se todos os irmãos da igreja gastassem assim, o testemunho cristão seria fortalecido?"
      ]
    },
    {
      title: "3. Amor ao próximo e generosidade",
      verse: "2Co 9:7",
      questions: [
        "Esse gasto não me impede de ajudar alguém necessitado se Deus abrir essa oportunidade?",
        "Tenho sido generoso recentemente e mantenho meu coração aberto para repartir?",
        "Há alguém próximo com necessidade maior que eu poderia atender antes dessa compra?"
      ]
    },
    {
      title: "4. Testemunho e contentamento",
      verse: "Hb 13:5",
      questions: [
        "O motivo real desse gasto é servir, e não ostentar ou buscar aprovação?",
        "Estou comprando por real necessidade, e não por comparação com outros?",
        "Essa decisão fortalece meu contentamento em Cristo, e não alimenta minha cobiça?"
      ]
    },
    {
      title: "5. Eternidade e propósito",
      verse: "Mt 6:19–21",
      questions: [
        "Esse gasto tem algum valor espiritual ou contribui, direta ou indiretamente, para o Reino de Deus?",
        "Se Cristo voltasse hoje, eu não me envergonharia dessa escolha?",
        "Posso agradecer a Deus por isso com alegria sincera e consciência tranquila?"
      ]
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Guia de Decisão Cristã</h2>
      <textarea
        placeholder="Descreva a decisão (ex: comprar um celular novo)"
        value={decisionData.description}
        onChange={e => setDecisionData({...decisionData, description: e.target.value})}
        className="w-full p-3 border rounded h-20 mb-6"
      />

      {sections.map((section, idx) => {
        const key = ['alinhamento', 'mordomia', 'generosidade', 'testemunho', 'eternidade'][idx];
        const checks = decisionData[key] || [];

        return (
          <div key={idx} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">{section.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{section.verse}</p>
            {section.questions.map((q, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={checks[i] || false}
                  onChange={e => {
                    const newChecks = [...checks];
                    newChecks[i] = e.target.checked;
                    setDecisionData({...decisionData, [key]: newChecks});
                  }}
                />
                <span className="flex-1 text-sm">{q}</span>
              </div>
            ))}
            <textarea
              placeholder="Anotações (opcional)"
              value={decisionData.anotacoes[idx] || ''}
              onChange={e => {
                const arr = [...(decisionData.anotacoes || [])];
                arr[idx] = e.target.value;
                setDecisionData({...decisionData, anotacoes: arr});
              }}
              className="w-full p-2 border rounded mt-2 text-sm"
              rows="2"
            />
          </div>
        );
      })}

      <button onClick={salvarDecisao} className="bg-blue-600 text-white px-8 py-3 rounded flex items-center gap-2 mx-auto">
        <Save size={20} /> Salvar Decisão
      </button>
    </div>
  );
};

export default GuiaDecisao;
