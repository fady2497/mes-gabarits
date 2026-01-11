import React, { useState, useEffect } from 'react'
import { Download, Search, Filter, Eye, Star, ShoppingCart } from 'lucide-react'
import { useTemplateStore } from '../stores/templateStore'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'

const CatalogMotoPage: React.FC = () => {
  const { templates, loading, fetchTemplates } = useTemplateStore()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  useEffect(() => {
    fetchTemplates({ type: 'moto', isPublic: true })
  }, [])

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = async (templateId: string, format: 'pdf' | 'svg' | 'png' | 'dxf') => {
    if (!user) {
      alert('Veuillez vous connecter pour télécharger')
      return
    }
    // Implémenter le téléchargement
    console.log(`Téléchargement du template ${templateId} en format ${format}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Catalogue Moto Premium
            </h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Découvrez notre collection exclusive de gabarits professionnels pour motos
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des gabarits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="sport">Sport</option>
              <option value="touring">Touring</option>
              <option value="cruiser">Cruiser</option>
              <option value="custom">Custom</option>
            </select>

            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            {filteredTemplates.length} gabarit{filteredTemplates.length !== 1 ? 's' : ''} trouvé{filteredTemplates.length !== 1 ? 's' : ''}
          </p>
          {!user && (
            <div className="text-amber-400 text-sm">
              💡 Connectez-vous pour télécharger les gabarits premium
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}

        {/* Templates Grid/List */}
        {!loading && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`group bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4' : ''
                }`}
              >
                {/* Template Image */}
                <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24 flex-shrink-0'} bg-gray-800 overflow-hidden`}>
                  {template.thumbnail_url ? (
                    <img
                      src={template.thumbnail_url}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Premium Badge */}
                  {template.is_premium && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3 h-3 inline mr-1" />
                      PREMIUM
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(template.id, 'pdf')}
                        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
                        disabled={!user && template.is_premium}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Template Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 ml-4' : ''}`}>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {template.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-amber-400 text-sm font-semibold">
                      {template.is_premium ? 'Premium' : 'Gratuit'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun gabarit trouvé</h3>
            <p className="text-gray-400 mb-6">
              Essayez d'ajuster vos filtres de recherche ou explorez notre catalogue complet
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden">
                  {selectedTemplate.thumbnail_url ? (
                    <img
                      src={selectedTemplate.thumbnail_url}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {selectedTemplate.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-300">{selectedTemplate.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Caractéristiques</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">Moto</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Format:</span>
                        <span className="text-white">PDF, SVG, PNG, DXF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Licence:</span>
                        <span className="text-white">{selectedTemplate.is_premium ? 'Premium' : 'Standard'}</span>
                      </div>
                    </div>
                  </div>

                  {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTemplate.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-amber-600/20 text-amber-400 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="premium"
                        onClick={() => handleDownload(selectedTemplate.id, 'pdf')}
                        disabled={!user && selectedTemplate.is_premium}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(selectedTemplate.id, 'svg')}
                        disabled={!user && selectedTemplate.is_premium}
                        className="w-full border-amber-500 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        SVG
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(selectedTemplate.id, 'png')}
                        disabled={!user && selectedTemplate.is_premium}
                        className="w-full border-amber-500 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PNG
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(selectedTemplate.id, 'dxf')}
                        disabled={!user && selectedTemplate.is_premium}
                        className="w-full border-amber-500 text-amber-400 hover:bg-amber-500/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        DXF
                      </Button>
                    </div>
                    {!user && selectedTemplate.is_premium && (
                      <p className="text-amber-400 text-sm text-center mt-3">
                        💡 Connectez-vous pour accéder aux gabarits premium
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CatalogMotoPage