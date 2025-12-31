import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const NewProperty = () => {
  const navigate = useNavigate();

  // URL DA SUA API (Ajuste conforme necessário)
  const API_URL = 'http://localhost:3000/properties'; 

  const [formData, setFormData] = useState({
    name: '',
    area: '',
    location: '',
  });

  // Estados de busca de cidade
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [status, setStatus] = useState({ loading: true, error: false });

  // Estados do formulário e arquivo
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // NOVO: Estado para mensagens de erro ou sucesso da API
  const [apiFeedback, setApiFeedback] = useState({ type: '', message: '' });

  // 1. Busca cidades do IBGE
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome'
        );
        if (!response.ok) throw new Error('Falha na API do IBGE');
        const data = await response.json();

        const formattedCities = data.map((city) => ({
          name: city.nome,
          uf: city?.microrregiao?.mesorregiao?.UF?.sigla || 'BR',
          full: `${city.nome} - ${city?.microrregiao?.mesorregiao?.UF?.sigla || 'BR'}`,
          searchString: `${city.nome} ${city?.microrregiao?.mesorregiao?.UF?.sigla || ''}`
            .toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        }));
        
        setCities(formattedCities);
        setStatus({ loading: false, error: false });
      } catch (error) {
        console.error("Erro IBGE:", error);
        setStatus({ loading: false, error: true });
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Filtro Instantâneo de Cidade
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (cities.length > 0 && value.length > 0) {
      const searchTerms = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const filtered = cities.filter((city) => city.searchString.includes(searchTerms));
      setFilteredCities(filtered.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (cityFull) => {
    setFormData({ ...formData, location: cityFull });
    setShowSuggestions(false);
  };

  // Funções de Upload
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  // --- AQUI ESTÁ A INTEGRAÇÃO REAL (Requirement: Integrar com API) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiFeedback({ type: '', message: '' });

    // Validação extra antes de enviar
    if (!file) {
      setApiFeedback({ type: 'error', message: 'Por favor, anexe o arquivo do mapa.' });
      return;
    }

    setSaving(true);

    try {
      // Cria o objeto FormData para enviar arquivo + texto
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('area', formData.area);
      dataToSend.append('location', formData.location);
      dataToSend.append('mapFile', file); // 'mapFile' é o nome do campo que o backend espera

      // Chamada Real (POST)
      const response = await fetch(API_URL, {
        method: 'POST',
        body: dataToSend,
        // Nota: Não defina Content-Type manualmente com FormData, o navegador faz isso.
      });

      if (!response.ok) {
        // Se der erro 400 ou 500, cai aqui
        throw new Error('Erro ao salvar propriedade. Verifique os dados.');
      }

      // Sucesso!
      setApiFeedback({ type: 'success', message: 'Propriedade salva com sucesso!' });
      
      // DoD: Redirecionar para o Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      // Requirement: Tratamento de erro
      console.error(error);
      setApiFeedback({ type: 'error', message: 'Erro no servidor. Tente novamente mais tarde.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-4 md:p-10">
      
      {/* CSS para remover setinhas do input number */}
      <style>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button { -webkit-appearance: none !important; margin: 0 !important; }
        .no-spinner { -moz-appearance: textfield !important; }
      `}</style>

      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Nova Propriedade</h2>
          <p className="text-sm text-gray-500 mt-1">Cadastro de área para monitoramento</p>
        </div>

        {/* MENSAGEM DE ERRO OU SUCESSO (Feedback visual) */}
        {apiFeedback.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            apiFeedback.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
          }`}>
            {apiFeedback.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
            <p className="text-sm font-medium">{apiFeedback.message}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible relative pb-10"
        >
          <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-50 bg-gray-50/50">
            <h3 className="font-semibold text-gray-800 text-lg">Informações da Área</h3>
            <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para iniciar o monitoramento.</p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome da Propriedade</label>
                <input
                  required
                  type="text"
                  name="name"
                  autoComplete="off" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Fazenda Santa Cruz"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Área Total</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="0"
                    className="no-spinner w-full pl-4 pr-20 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none select-none">
                    hectares
                  </span>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2 relative z-50">
                <label className="text-sm font-medium text-gray-700">Localização</label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleLocationChange}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={status.loading ? "Digite para buscar sua cidade." : "Digite para buscar sua cidade"}
                    disabled={status.loading}
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all disabled:bg-gray-50"
                  />
                  
                  <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                    {status.loading ? <Loader2 size={18} className="animate-spin text-green-600" /> : <MapPin size={18} />}
                  </div>

                  {showSuggestions && filteredCities.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                      {filteredCities.map((city, index) => (
                        <li
                          key={index}
                          onMouseDown={() => handleSelectCity(city.full)}
                          className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-700 text-sm border-b border-gray-50 last:border-0 flex items-center justify-between group"
                        >
                          <span className="font-medium group-hover:text-green-700">{city.name}</span>
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-green-100 group-hover:text-green-700">
                            {city.uf}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 relative z-0">
              <label className="text-sm font-medium text-gray-700">Arquivo do Mapa (GeoJSON/KML)</label>
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${
                    dragging ? 'border-green-500 bg-green-50/50 scale-[0.99]' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                     <Upload className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-gray-900 font-medium">Clique para fazer upload ou arraste e solte</p>
                  <p className="text-gray-500 text-sm mt-1">.geojson, .kml, .shp (max 10MB)</p>
                  <input type="file" className="hidden" id="map-upload" onChange={handleFileSelect} accept=".geojson,.kml,.shp,.json" />
                  <label htmlFor="map-upload" className="absolute inset-0 cursor-pointer" />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-green-200 rounded-lg text-green-800 shrink-0"><Upload size={20} /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-green-700">Pronto para envio</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-lg shrink-0"><X size={20} /></button>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
            <button type="submit" disabled={saving} className={`px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm shadow-green-200 transition-all ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}>{saving ? 'Salvando...' : 'Salvar Propriedade'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProperty;