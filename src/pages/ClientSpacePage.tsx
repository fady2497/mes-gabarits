import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Download, Plus, Eye, Edit, Trash2, FileText } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useTemplateStore } from '../stores/templateStore';
import { Button } from '../components/ui/button';

const ClientSpacePage: React.FC<{ defaultTab?: string }> = ({ defaultTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { user } = useAuthStore();
  const { templates, fetchTemplates } = useTemplateStore();

  useEffect(() => {
    if (user) {
      fetchTemplates({ isPublic: false });
    }
  }, [user]);

  const userTemplates = templates.filter((template) => template.user_id === user?.id);

  const tabs = [
    { id: 'dashboard', name: 'Tableau de bord', icon: User },
    { id: 'projects', name: 'Mes projets', icon: FileText },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Espace Client</h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Gérez vos projets et paramètres personnels
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700 sticky top-8">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user?.plan === 'premium'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {user?.plan === 'premium' ? 'Premium' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="text-white font-semibold mb-3">Actions rapides</h4>
                <div className="space-y-2">
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-amber-500 text-amber-400 hover:bg-amber-500/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Demander un projet
                    </Button>
                  </Link>
                  <Link to="/catalogue/moto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Voir catalogue
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Projets créés</p>
                        <p className="text-3xl font-bold text-white">{userTemplates.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Téléchargements</p>
                        <p className="text-3xl font-bold text-white">0</p>
                      </div>
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                        <Download className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Plan actuel</p>
                        <p className="text-3xl font-bold text-white capitalize">{user?.plan}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Projets récents</h3>
                    <Link to="/contact">
                      <Button variant="premium" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Demander un projet
                      </Button>
                    </Link>
                  </div>

                  {userTemplates.length > 0 ? (
                    <div className="space-y-4">
                      {userTemplates.slice(0, 5).map((template) => (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{template.name}</h4>
                              <p className="text-gray-400 text-sm">
                                {new Date(template.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-amber-400 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-white font-medium mb-2">Aucun projet</h4>
                      <p className="text-gray-400 mb-4">Commencez par créer votre premier projet</p>
                      <Link to="/createur">
                        <Button variant="premium" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Créer un projet
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Link to="/catalogue/moto" className="block">
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-amber-500/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Catalogue Moto</h4>
                          <p className="text-gray-400 text-sm">
                            Découvrez nos gabarits professionnels
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to="/support" className="block">
                    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-amber-500/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Support</h4>
                          <p className="text-gray-400 text-sm">Aide et tutoriels</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Mes Projets</h3>
                  <Link to="/contact">
                    <Button variant="premium">
                      <Plus className="w-4 h-4 mr-2" />
                      Demander un projet
                    </Button>
                  </Link>
                </div>

                {userTemplates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700 hover:border-amber-500/50 transition-all duration-300"
                      >
                        <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        <h4 className="text-white font-semibold mb-2">{template.name}</h4>
                        {template.description && (
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {template.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs text-gray-500">
                            {new Date(template.created_at).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              template.is_premium
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {template.is_premium ? 'Premium' : 'Standard'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-3 rounded-lg text-sm transition-colors flex items-center justify-center">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <h4 className="text-white font-semibold text-xl mb-4">Aucun projet</h4>
                    <p className="text-gray-400 mb-6">Commencez par créer votre premier projet</p>
                    <Link to="/createur">
                      <Button variant="premium">
                        <Plus className="w-4 h-4 mr-2" />
                        Créer un projet
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">Informations personnelles</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={user?.first_name || ''}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                      <input
                        type="text"
                        value={user?.last_name || ''}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        readOnly
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-6">Plan et abonnement</h3>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Plan actuel</p>
                      <p className="text-gray-400 text-sm">
                        {user?.plan === 'premium' ? 'Premium' : 'Standard'}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user?.plan === 'premium'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {user?.plan === 'premium' ? 'Premium' : 'Standard'}
                      </span>
                    </div>
                  </div>

                  {user?.plan !== 'premium' && (
                    <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg p-4 mb-4">
                      <h4 className="text-amber-400 font-semibold mb-2">Passer à Premium</h4>
                      <p className="text-amber-300 text-sm mb-3">
                        Accédez à des gabarits exclusifs, des outils avancés et un support
                        prioritaire
                      </p>
                      <Button variant="premium" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Passer à Premium
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSpacePage;
