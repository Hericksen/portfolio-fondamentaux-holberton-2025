import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Zap, Trophy, Users, Smartphone, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-white text-2xl font-bold">PixelPump</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/login" 
            className="text-white hover:text-pink-300 transition-colors"
          >
            Connexion
          </Link>
          <Link 
            to="/register" 
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                Transforme ton
                <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
                  {" "}fitness{" "}
                </span>
                en jeu vidéo
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Gagne de l'XP, level-up ton avatar, débloque des achievements... 
                mais cette fois, les gains sont RÉELS sur ton corps ! 🎮💪
              </p>
            </div>

            {/* Stats */}
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">2.5K+</div>
                <div className="text-gray-400">Pumpers actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">150K+</div>
                <div className="text-gray-400">Quêtes complétées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">95%</div>
                <div className="text-gray-400">Motivation boosted</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Play className="w-6 h-6" />
                <span>Commencer l'aventure</span>
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all flex items-center justify-center space-x-2">
                <span>Voir la démo</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
              {/* Mock Dashboard Preview */}
              <div className="bg-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🎮</span>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">FitnessHero_2024</div>
                    <div className="text-purple-400">Level 12 • 2,450 XP</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white">💪 Beast Mode Challenge</span>
                    <span className="text-green-400 font-bold">+50 XP</span>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white">🏃 Speed Demon Run</span>
                    <span className="text-yellow-400 font-bold">En cours</span>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white">🧘 Zen Master Meditation</span>
                    <span className="text-blue-400 font-bold">+25 XP</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-lg p-3">
                  <div className="text-white text-sm mb-1">Progression vers Level 13</div>
                  <div className="bg-slate-600 rounded-full h-3">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full h-3 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
              +50 XP
            </div>
            <div className="absolute -bottom-4 -left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold animate-pulse">
              🏆 Level UP!
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-800/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Pourquoi PixelPump change tout ?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fini les motivations qui s'essoufflent ! Notre système de gamification transforme chaque workout en victoire.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "XP System",
                description: "Chaque exercice te fait gagner de l'expérience réelle"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Achievements",
                description: "Débloque des badges pour tes exploits fitness"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Avatar Unique",
                description: "Personnalise ton héros qui évolue avec toi"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Quêtes Quotidiennes",
                description: "Des défis adaptés à ton niveau et tes objectifs"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-900/50 rounded-2xl p-6 border border-white/10 hover:border-pink-500/30 transition-colors">
                <div className="text-pink-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Rejoins la communauté des Pumpers !
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Des milliers d'utilisateurs ont déjà transformé leur routine fitness
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Sarah_FitnessQueen",
                level: "Level 28",
                quote: "J'ai perdu 15kg en m'amusant ! Le système d'XP m'a rendu accro au sport.",
                avatar: "👩‍🦰"
              },
              {
                name: "Mike_MuscleMaster",
                level: "Level 35",
                quote: "Fini les excuses ! Mes quêtes quotidiennes me motivent chaque matin.",
                avatar: "🧔"
              },
              {
                name: "Luna_YogaWarrior",
                level: "Level 22",
                quote: "L'avatar qui évolue avec moi, c'est génial ! Je vois mes progrès visuellement.",
                avatar: "🧘‍♀️"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <div className="text-white font-bold mb-1">{testimonial.name}</div>
                <div className="text-purple-400 text-sm mb-4">{testimonial.level}</div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>

          <Link 
            to="/register"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 inline-flex items-center space-x-3"
          >
            <span>Devenir un Pumper</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-white text-xl font-bold">PixelPump</span>
          </div>
          <p className="text-gray-400 mb-4">
            Transforme ton fitness en jeu vidéo • Créé avec ❤️ pour les gamers sportifs
          </p>
          <div className="text-gray-500 text-sm">
            © 2025 PixelPump. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
