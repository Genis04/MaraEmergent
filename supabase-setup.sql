-- Configuración de la base de datos para Mara Productions
-- Ejecutar en Supabase SQL Editor

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen TEXT NOT NULL,
    pais VARCHAR(100) NOT NULL,
    fecha_lanzamiento DATE NOT NULL,
    plataformas TEXT[], -- Array de strings
    categoria VARCHAR(50) NOT NULL,
    subcategoria VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS site_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de redes sociales
CREATE TABLE IF NOT EXISTS social_networks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de grupos de negocio
CREATE TABLE IF NOT EXISTS business_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products(categoria);
CREATE INDEX IF NOT EXISTS idx_products_subcategoria ON products(subcategoria);
CREATE INDEX IF NOT EXISTS idx_products_fecha ON products(fecha_lanzamiento);
CREATE INDEX IF NOT EXISTS idx_products_titulo ON products USING gin(to_tsvector('spanish', titulo));
CREATE INDEX IF NOT EXISTS idx_products_descripcion ON products USING gin(to_tsvector('spanish', descripcion));
CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security) - Opcional, para seguridad adicional
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE social_networks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE business_groups ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir lectura pública
-- CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access on site_config" ON site_config FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access on social_networks" ON social_networks FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access on business_groups" ON business_groups FOR SELECT USING (true);

-- Insertar datos de ejemplo
INSERT INTO products (titulo, descripcion, imagen, pais, fecha_lanzamiento, plataformas, categoria, subcategoria) VALUES
('Cyberpunk 2077', 'RPG futurista en Night City con gráficos impresionantes', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop', 'Polonia', '2020-12-10', ARRAY['PC', 'PlayStation', 'Xbox'], 'juegos', 'pc'),
('The Witcher 3', 'Aventura épica con Geralt de Rivia en mundo abierto', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop', 'Polonia', '2015-05-19', ARRAY['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'], 'juegos', 'pc'),
('Minecraft', 'Juego de construcción y supervivencia con bloques infinitos', 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop', 'Suecia', '2011-11-18', ARRAY['PC', 'Mobile', 'Consolas'], 'juegos', 'pc'),
('Halo Infinite', 'Shooter épico del Master Chief en el universo Halo', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop', 'Estados Unidos', '2021-12-08', ARRAY['Xbox One', 'Xbox Series', 'PC'], 'juegos', 'xboxOne'),
('Forza Horizon 5', 'Carreras de mundo abierto en los paisajes de México', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop', 'Reino Unido', '2021-11-09', ARRAY['Xbox One', 'Xbox Series', 'PC'], 'juegos', 'xboxOne'),
('Microsoft Flight Simulator', 'Simulador de vuelo ultra-realista con mundo completo', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop', 'Estados Unidos', '2020-08-18', ARRAY['Xbox Series S/X', 'PC'], 'juegos', 'xboxSeries'),
('Instagram', 'Red social para compartir fotos y videos', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', 'Estados Unidos', '2010-10-06', ARRAY['iOS', 'Android'], 'aplicaciones', 'apple'),
('Spotify', 'Plataforma de streaming de música y podcasts', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop', 'Suecia', '2008-10-07', ARRAY['iOS', 'Android', 'Desktop'], 'aplicaciones', 'apple'),
('WhatsApp', 'Aplicación de mensajería instantánea segura y rápida', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop', 'Estados Unidos', '2009-01-01', ARRAY['Android', 'iOS', 'Desktop'], 'aplicaciones', 'android'),
('Stranger Things', 'Misterios sobrenaturales en un pueblo de los años 80', 'https://images.unsplash.com/photo-1489599162346-00d32db2e95b?w=400&h=300&fit=crop', 'Estados Unidos', '2016-07-15', NULL, 'seriesTV', NULL),
('The Mandalorian', 'Aventuras de un cazarrecompensas en el universo Star Wars', 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=300&fit=crop', 'Estados Unidos', '2019-11-12', NULL, 'seriesTV', NULL),
('La Casa de las Flores', 'Drama familiar mexicano lleno de secretos y comedia', 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=300&fit=crop', 'México', '2018-08-10', NULL, 'telenovelas', NULL),
('Avengers: Endgame', 'Épica conclusión de la saga del infinito de Marvel', 'https://images.unsplash.com/photo-1635863138275-d9864d513ab9?w=400&h=300&fit=crop', 'Estados Unidos', '2019-04-26', NULL, 'peliculas', NULL),
('Parasite', 'Thriller surcoreano ganador del Oscar a mejor película', 'https://images.unsplash.com/photo-1489599162346-00d32db2e95b?w=400&h=300&fit=crop', 'Corea del Sur', '2019-05-30', NULL, 'peliculas', NULL),
('Survivor', 'Competencia de supervivencia en locaciones exóticas', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 'Estados Unidos', '2000-05-31', NULL, 'realitys', NULL),
('Toy Story 4', 'Nueva aventura de Woody y Buzz con nuevos amigos', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 'Estados Unidos', '2019-06-21', NULL, 'animados', NULL),
('Attack on Titan', 'Humanidad luchando contra titanes gigantes por supervivencia', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 'Japón', '2013-04-07', NULL, 'animes', NULL),
('Demon Slayer', 'Joven cazador de demonios en el Japón del período Taishō', 'https://images.unsplash.com/photo-1578662015715-bb5cb8c3bdac?w=400&h=300&fit=crop', 'Japón', '2019-04-06', NULL, 'animes', NULL);

-- Insertar configuración inicial del sitio
INSERT INTO site_config (key, value) VALUES
('logo', ''),
('site_title', 'Mara Productions'),
('site_description', 'Tu fuente confiable para el mejor entretenimiento digital');

-- Insertar redes sociales de ejemplo
INSERT INTO social_networks (name, url, icon, is_active) VALUES
('Facebook', '', 'Facebook', false),
('Instagram', '', 'Instagram', false),
('Twitter', '', 'Twitter', false),
('YouTube', '', 'Youtube', false);

-- Insertar grupos de negocio de ejemplo
INSERT INTO business_groups (name, description, link, is_active) VALUES
('Grupo Principal', 'Grupo principal de Mara Productions', '', false);