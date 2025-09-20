import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { AdminPanel } from "./components/AdminPanel";
import { AuthModal } from "./components/AuthModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { mockData } from "./mock";

const Home = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleAdminClick = () => {
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setShowAdmin(true);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  const handleAdminClose = () => {
    setShowAdmin(false);
  };

  const renderProductGrid = (products) => {
    if (!products || products.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-emerald-600">
          <p className="text-lg">No hay productos disponibles en esta categoría</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  const renderJuegos = () => (
    <Tabs defaultValue="pc" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-emerald-50 p-1 rounded-lg">
        <TabsTrigger 
          value="pc" 
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200"
        >
          PC
        </TabsTrigger>
        <TabsTrigger 
          value="xboxOne"
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200"
        >
          Xbox One
        </TabsTrigger>
        <TabsTrigger 
          value="xboxSeries"
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200"
        >
          Xbox Series S/X
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pc">{renderProductGrid(mockData.juegos.pc)}</TabsContent>
      <TabsContent value="xboxOne">{renderProductGrid(mockData.juegos.xboxOne)}</TabsContent>
      <TabsContent value="xboxSeries">{renderProductGrid(mockData.juegos.xboxSeries)}</TabsContent>
    </Tabs>
  );

  const renderAplicaciones = () => (
    <Tabs defaultValue="apple" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-emerald-50 p-1 rounded-lg max-w-md">
        <TabsTrigger 
          value="apple"
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200"
        >
          Apple
        </TabsTrigger>
        <TabsTrigger 
          value="android"
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200"
        >
          Android
        </TabsTrigger>
      </TabsList>
      <TabsContent value="apple">{renderProductGrid(mockData.aplicaciones.apple)}</TabsContent>
      <TabsContent value="android">{renderProductGrid(mockData.aplicaciones.android)}</TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <Header onAdminClick={() => setShowAdmin(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            Catálogo Mara Productions
          </h1>
          <p className="text-xl text-emerald-700 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra amplia colección de entretenimiento digital: juegos, aplicaciones, series y mucho más
          </p>
        </div>

        <Tabs defaultValue="juegos" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-emerald-100">
            <TabsTrigger 
              value="juegos"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Juegos
            </TabsTrigger>
            <TabsTrigger 
              value="aplicaciones"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Aplicaciones
            </TabsTrigger>
            <TabsTrigger 
              value="seriesTV"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Series TV
            </TabsTrigger>
            <TabsTrigger 
              value="telenovelas"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Telenovelas
            </TabsTrigger>
            <TabsTrigger 
              value="peliculas"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Películas
            </TabsTrigger>
            <TabsTrigger 
              value="realitys"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Realitys
            </TabsTrigger>
            <TabsTrigger 
              value="animados"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Animados
            </TabsTrigger>
            <TabsTrigger 
              value="animes"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-emerald-700 transition-all duration-200 font-medium"
            >
              Animes
            </TabsTrigger>
          </TabsList>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-emerald-100">
            <TabsContent value="juegos">{renderJuegos()}</TabsContent>
            <TabsContent value="aplicaciones">{renderAplicaciones()}</TabsContent>
            <TabsContent value="seriesTV">{renderProductGrid(mockData.seriesTV)}</TabsContent>
            <TabsContent value="telenovelas">{renderProductGrid(mockData.telenovelas)}</TabsContent>
            <TabsContent value="peliculas">{renderProductGrid(mockData.peliculas)}</TabsContent>
            <TabsContent value="realitys">{renderProductGrid(mockData.realitys)}</TabsContent>
            <TabsContent value="animados">{renderProductGrid(mockData.animados)}</TabsContent>
            <TabsContent value="animes">{renderProductGrid(mockData.animes)}</TabsContent>
          </div>
        </Tabs>
      </main>

      <footer className="bg-emerald-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Mara Productions</h3>
            <p className="text-emerald-200 mb-6 max-w-2xl mx-auto">
              Tu fuente confiable para el mejor entretenimiento digital. Catálogo actualizado constantemente con las últimas novedades.
            </p>
            <div className="border-t border-emerald-800 pt-6">
              <p className="text-emerald-300 text-sm">
                © 2024 Mara Productions. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;