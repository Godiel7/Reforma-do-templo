import React from 'react';

const GuiaDecisao = ({ decisionData, setDecisionData, salvarDecisao }) => {
  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Guia de Decisão Cristã
      </h2>
      <p className="text-gray-700 mb-4">
        Preencha a descrição da decisão e clique em salvar.
      </p>

      <textarea
        value={decisionData.description}
        onChange={(e) => setDecisionData({ ...decisionData, description: e.target.value })}
        placeholder="Ex: Comprar um celular novo..."
        className="w-full p-3 border rounded-lg h-32 mb-4"
      />

      <button
        onClick={salvarDecisao}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
      >
        Salvar Decisão
      </button>
    </div>
  );
};

export default GuiaDecisao;
