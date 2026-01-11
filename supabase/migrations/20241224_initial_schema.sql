-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('moto', 'voiture', 'maison', 'bateau')),
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des gabarits
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    data JSONB NOT NULL,
    thumbnail_url TEXT,
    download_url TEXT,
    is_public BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    tags TEXT[],
    dimensions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des téléchargements
CREATE TABLE downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
    format VARCHAR(10) CHECK (format IN ('pdf', 'svg', 'png', 'dxf')),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Données initiales des catégories
INSERT INTO categories (name, type, specifications) VALUES
('Sport', 'moto', '{"wheels": 2, "typical_size": {"width": 2000, "height": 1200}, "default_material": "cuir"}'),
('Cruiser', 'moto', '{"wheels": 2, "typical_size": {"width": 2500, "height": 1300}, "default_material": "cuir"}'),
('Berline', 'voiture', '{"wheels": 4, "typical_size": {"width": 4800, "height": 1800}, "default_material": "tissu"}'),
('SUV', 'voiture', '{"wheels": 4, "typical_size": {"width": 5000, "height": 2000}, "default_material": "tissu"}'),
('Maison individuelle', 'maison', '{"floors": 2, "typical_size": {"width": 10000, "height": 8000}, "default_material": "bois"}'),
('Appartement', 'maison', '{"floors": 1, "typical_size": {"width": 8000, "height": 6000}, "default_material": "bois"}'),
('Bateau de plaisance', 'bateau', '{"hull_type": "monocoque", "typical_size": {"width": 8000, "height": 3000}, "default_material": "pvc"}'),
('Yacht', 'bateau', '{"hull_type": "multicoque", "typical_size": {"width": 15000, "height": 5000}, "default_material": "cuir"}');

-- Index pour les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_templates_user_id ON templates(user_id);
CREATE INDEX idx_templates_category ON templates(category_id);
CREATE INDEX idx_templates_public ON templates(is_public) WHERE is_public = true;
CREATE INDEX idx_templates_premium ON templates(is_premium) WHERE is_premium = true;
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_template_id ON downloads(template_id);

-- Politiques de sécurité RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Politiques pour users (lecture publique des infos basiques)
CREATE POLICY "Users can view public profiles" ON users FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" ON users FOR UPDATE 
USING (auth.uid() = id);

-- Politiques pour templates
CREATE POLICY "Public templates are viewable by everyone" ON templates FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can view own templates" ON templates FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create templates" ON templates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON templates FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON templates FOR DELETE 
USING (auth.uid() = user_id);

-- Politiques pour downloads
CREATE POLICY "Users can view own downloads" ON downloads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create downloads" ON downloads FOR INSERT 
WITH CHECK (auth.uid() = user_id);