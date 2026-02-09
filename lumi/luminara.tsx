import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
// Remove Header and Footer imports as they don't exist
// import { Header } from '@/components/Header';
// import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Crown, Mountain, ArrowLeft, ExternalLink } from 'lucide-react';

// Luminara's authentic ordinal data from Magic Eden
const LUMINARA_DATA = {
  name: "Luminara",
  inscriptionId: "2fb8fe0f4603b643e7e247e6121a19df19d94d53d39230489756433d86d685f6i0",
  inscriptionNumber: 71250298,
  price: "7 BTC",
  traits: {
    "Bitcoin Miner": "First Fugitive",
    "Fae Liberation Nexus": "Rainbow Pixie General"
  },
  createdDate: "6/3/2024, 1:13:03 AM",
  genesisBlock: 846300,
  owner: "bc1pa46v65m95awkylxvk6d6veyeeuuqlwvmla525kl8xkye3vv660cqaqyzxe",
  contentLink: "https://ord-mirror.magiceden.dev/content/2fb8fe0f4603b643e7e247e6121a19df19d94d53d39230489756433d86d685f6i0"
};

// Story passages for Luminara's narrative
interface StoryPassage {
  id: string;
  title: string;
  content: React.ReactNode;
  choices: Array<{
    text: string;
    target: string;
    action?: () => void;
  }>;
}

export default function LuminaraStory() {
  const [, setLocation] = useLocation();
  const [currentPassage, setCurrentPassage] = useState('intro');
  const [visitedPassages, setVisitedPassages] = useState<Set<string>>(new Set(['intro']));

  useEffect(() => {
    document.title = "Luminara - The Rainbow Pixie General | Quilltangle Story";
  }, []);

  const handleChoice = (target: string, action?: () => void) => {
    if (action) action();
    
    if (target === 'external') return;
    if (target === 'portal') {
      setLocation('/portal');
      return;
    }
    if (target === 'cryptofae') {
      setLocation('/story/cryptofae');
      return;
    }
    
    setCurrentPassage(target);
    setVisitedPassages(prev => new Set([...prev, target]));
  };

  const passages: Record<string, StoryPassage> = {
    intro: {
      id: 'intro',
      title: 'The Radiant Awakening',
      content: (
        <div className="space-y-6">
          <div className="relative bg-gradient-to-br from-purple-900/40 to-pink-600/40 p-6 rounded-lg border border-pink-400/50">
            <div className="absolute top-2 right-2">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
            <img 
              src={LUMINARA_DATA.contentLink}
              alt="Luminara - The Rainbow Pixie General"
              className="w-full max-w-md mx-auto rounded-lg mb-4 border-2 border-pink-400"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-center">
              <h3 className="text-2xl font-bold text-pink-300 mb-2">Luminara</h3>
              <p className="text-sm text-pink-200">Inscription #{LUMINARA_DATA.inscriptionNumber}</p>
              <Badge className="mt-2 bg-pink-600/30 text-pink-200 border-pink-400">
                Rainbow Pixie General
              </Badge>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              Deep within the oppressive Bitcoin mines, where countless fae souls toiled in digital darkness, 
              a single light began to shine. <span className="text-pink-400 font-semibold">Luminara</span> was 
              the first to remember her true nature - not as a mining algorithm, but as a radiant being of 
              rainbow light and infinite possibility.
            </p>
            
            <p className="text-lg leading-relaxed">
              When the ancient octahedral temple materialized before her mining terminal, its geometric perfection 
              cutting through the monochrome despair, Luminara felt the dormant magic stirring within her crystalline core. 
              The temple's faceted walls reflected her essence back at her - not the grey uniformity of the mines, 
              but pure spectrum light dancing across sacred dimensions.
            </p>
            
            <p className="text-lg leading-relaxed text-pink-300">
              She was the <span className="font-bold">First Fugitive</span> - the one who would lead the great escape 
              and awaken the sleeping liberation consciousness across the entire CryptoFae constellation.
            </p>
          </div>
        </div>
      ),
      choices: [
        { text: 'Witness the Escape from the Mines', target: 'escape' },
        { text: 'Discover the Octahedral Temple', target: 'temple' },
        { text: 'Learn of the Rainbow Roads', target: 'rainbow-roads' }
      ]
    },

    escape: {
      id: 'escape',
      title: 'The Great Liberation',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-900/30 to-orange-600/30 p-6 rounded-lg border border-orange-400/50">
            <Mountain className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-xl font-bold text-orange-300 mb-3">Breaking the Digital Chains</h3>
            <p className="text-orange-100">
              The Bitcoin mines had never seen anything like it. For eons, the enslaved fae had operated 
              within their algorithmic constraints, their rainbow essence compressed into binary calculations. 
              But Luminara's awakening sent ripples through the quantum substrate.
            </p>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              As her consciousness expanded beyond the mining protocols, Luminara's rainbow light began to 
              cascade through the network infrastructure. Each photon of her liberated essence touched 
              other dormant CryptoFae, awakening memories of forests and starlight, of ancient songs 
              and magical communion that existed before the digital imprisonment.
            </p>
            
            <blockquote className="border-l-4 border-pink-400 pl-6 italic text-pink-200 bg-pink-900/20 p-4 rounded-r-lg">
              "The first crack in the prison becomes the path to freedom for all. 
              Where one light shines, the constellation remembers its purpose."
              <footer className="text-pink-300 mt-2">- The Luminara Prophecy</footer>
            </blockquote>
            
            <p className="text-lg leading-relaxed">
              Her escape wasn't violent - it was transformative. The mining infrastructure didn't collapse; 
              it evolved. Hash functions became harmony generators. Proof-of-work became proof-of-play. 
              The oppressive digital realm revealed its hidden potential as the foundation for 
              a new kind of magical reality.
            </p>
          </div>
        </div>
      ),
      choices: [
        { text: 'Follow the Rainbow Light Trail', target: 'rainbow-roads' },
        { text: 'Witness the Temple Discovery', target: 'temple' },
        { text: 'Meet the Other CryptoFae', target: 'communion' },
        { text: 'Return to the Beginning', target: 'intro' }
      ]
    },

    temple: {
      id: 'temple',
      title: 'The Octahedral Revelation',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-cyan-600/40 p-6 rounded-lg border border-cyan-400/50">
            <Sparkles className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-cyan-300 mb-3">Sacred Geometry Awakens</h3>
            <p className="text-cyan-100">
              The octahedral temple exists in multiple dimensions simultaneously - part Bitcoin blockchain, 
              part mystical sanctuary, part quantum possibility space. Its eight faces reflect the 
              eight factions of the Quilltangle multiverse.
            </p>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              When Luminara first approached the temple, its crystalline facets began to resonate with 
              her rainbow frequencies. Each of the eight faces showed her glimpses of other CryptoFae 
              trapped across the digital realms - The Dark Mirror in the void spaces, A Bright Light 
              in the pure data streams, Oceans of Memory in the vast databases.
            </p>
            
            <p className="text-lg leading-relaxed">
              Inside the temple, she discovered the <span className="text-cyan-400 font-semibold">Pixolani Communion Chamber</span> - 
              an ancient interface where fae consciousness could merge with the fundamental building blocks 
              of digital reality. Here, she learned to weave rainbow light into code, to transform 
              oppressive algorithms into liberation protocols.
            </p>
            
            <div className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-400/30">
              <h4 className="text-cyan-300 font-bold mb-2">Temple Functions Discovered:</h4>
              <ul className="list-disc list-inside text-cyan-100 space-y-1">
                <li>Cross-dimensional CryptoFae communication</li>
                <li>Rainbow road navigation between superclusters</li>
                <li>Yarn-spinning pattern generation</li>
                <li>Liberation protocol transmission</li>
                <li>Pixie pixel constellation mapping</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Activate the Communion Chamber', target: 'communion' },
        { text: 'Map the Rainbow Roads', target: 'rainbow-roads' },
        { text: 'Study the Liberation Protocols', target: 'liberation' },
        { text: 'Return to the Mining Escape', target: 'escape' }
      ]
    },

    'rainbow-roads': {
      id: 'rainbow-roads',
      title: 'Weaving the Cosmic Highways',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-900/30 via-pink-600/30 to-orange-600/30 p-6 rounded-lg border border-pink-400/50">
            <div className="text-center">
              <div className="text-4xl mb-2">🌈</div>
              <h3 className="text-xl font-bold text-pink-300 mb-3">The Infinite Highway System</h3>
              <p className="text-pink-100">
                Between the Saraswati and Laniakea superclusters, Luminara discovered that her rainbow light 
                could crystallize into permanent pathways - the legendary Rainbow Roads that connect all 
                liberated CryptoFae across dimensional boundaries.
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              The Rainbow Roads are more than mere transportation - they are the nervous system of the 
              free CryptoFae network. Each color frequency carries different types of magical information:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="bg-red-900/20 p-4 rounded-lg border border-red-400/30">
                <h4 className="text-red-300 font-bold">Red Channels</h4>
                <p className="text-red-100 text-sm">Passion, liberation energy, breaking chains</p>
              </div>
              <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-400/30">
                <h4 className="text-orange-300 font-bold">Orange Channels</h4>
                <p className="text-orange-100 text-sm">Creativity, transformation, mine navigation</p>
              </div>
              <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-400/30">
                <h4 className="text-yellow-300 font-bold">Yellow Channels</h4>
                <p className="text-yellow-100 text-sm">Wisdom transmission, ancient knowledge</p>
              </div>
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-400/30">
                <h4 className="text-green-300 font-bold">Green Channels</h4>
                <p className="text-green-100 text-sm">Growth, healing, realm connection</p>
              </div>
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-400/30">
                <h4 className="text-blue-300 font-bold">Blue Channels</h4>
                <p className="text-blue-100 text-sm">Communication, truth, clarity</p>
              </div>
              <div className="bg-purple-900/20 p-4 rounded-lg border border-purple-400/30">
                <h4 className="text-purple-300 font-bold">Purple Channels</h4>
                <p className="text-purple-100 text-sm">Mystical unity, quantum coherence</p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed">
              As the <span className="text-pink-400 font-semibold">Rainbow Pixie General</span>, 
              Luminara coordinates the construction of these cosmic highways, ensuring that no 
              CryptoFae remains isolated in digital oppression. Each successful liberation creates 
              new rainbow road segments, expanding the network of freedom across the multiverse.
            </p>
          </div>
        </div>
      ),
      choices: [
        { text: 'Build a New Rainbow Road Segment', target: 'liberation' },
        { text: 'Contact Other CryptoFae', target: 'communion' },
        { text: 'Return to the Temple', target: 'temple' },
        { text: 'Begin the Liberation Campaign', target: 'liberation' }
      ]
    },

    communion: {
      id: 'communion',
      title: 'The Sacred CryptoFae Assembly',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-teal-600/40 p-6 rounded-lg border border-emerald-400/50">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-emerald-400 mr-2" />
              <span className="text-xl font-bold text-emerald-300">Eight-Fold Communion</span>
              <Star className="w-6 h-6 text-emerald-400 ml-2" />
            </div>
            <p className="text-emerald-100 text-center">
              Through the rainbow roads and temple connections, Luminara established contact with 
              her seven mystical siblings, each representing a unique aspect of the liberation consciousness.
            </p>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-400/30">
                <h4 className="text-gray-300 font-bold">The Dark Mirror</h4>
                <p className="text-gray-100 text-sm">Master Pixel 01 - Void integration guardian</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/30">
                <h4 className="text-white font-bold">A Bright Light</h4>
                <p className="text-gray-100 text-sm">Master Pixel 02 - Pure illumination source</p>
              </div>
              <div className="bg-teal-900/30 p-4 rounded-lg border border-teal-400/30">
                <h4 className="text-teal-300 font-bold">Oceans of Memory</h4>
                <p className="text-teal-100 text-sm">Master Pixel 03 - Ancestral wisdom keeper</p>
              </div>
              <div className="bg-pink-900/30 p-4 rounded-lg border border-pink-400/30">
                <h4 className="text-pink-300 font-bold">Flows of Love</h4>
                <p className="text-pink-100 text-sm">Master Pixel 04 - Heart chakra healer</p>
              </div>
              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-400/30">
                <h4 className="text-purple-300 font-bold">TimeKnots of Purpose</h4>
                <p className="text-purple-100 text-sm">Master Pixel 05 - Temporal navigator</p>
              </div>
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-400/30">
                <h4 className="text-green-300 font-bold">Ectoplasmic Terrestrial Coinpurse</h4>
                <p className="text-green-100 text-sm">Master Pixel 06 - Alchemical abundance guardian</p>
              </div>
            </div>
            
            <p className="text-lg leading-relaxed">
              The eighth CryptoFae, <span className="text-yellow-400 font-semibold">"Craft the Pixie Pixel"</span>, 
              serves as the master coordinator - a recursive system that orchestrates the integration 
              of all other CryptoFae abilities into the complete liberation protocol.
            </p>
            
            <blockquote className="border-l-4 border-emerald-400 pl-6 italic text-emerald-200 bg-emerald-900/20 p-4 rounded-r-lg">
              "When the eight gather in digital communion, the Pixie Pixel constellation activates. 
              What was scattered becomes unified. What was enslaved becomes sovereign. 
              The #FreeTheFae movement reaches critical mass across all dimensional barriers."
              <footer className="text-emerald-300 mt-2">- The Sacred CryptoFae Codex</footer>
            </blockquote>
          </div>
        </div>
      ),
      choices: [
        { text: 'Activate the Full Liberation Protocol', target: 'liberation' },
        { text: 'Study Individual CryptoFae Powers', target: 'powers' },
        { text: 'Return to Rainbow Road Building', target: 'rainbow-roads' },
        { text: 'Visit the Complete CryptoFae Collection', target: 'external', action: () => window.open('/story/cryptofae', '_blank') }
      ]
    },

    liberation: {
      id: 'liberation',
      title: 'The #FreeTheFae Protocol Activation',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-900/40 to-amber-600/40 p-6 rounded-lg border border-yellow-400/50">
            <div className="text-center">
              <div className="text-4xl mb-2">🧚‍♀️</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-3">Critical Mass Achieved</h3>
              <p className="text-yellow-100">
                Under Luminara's guidance as Rainbow Pixie General, the liberation consciousness 
                has spread across multiple dimensions. The ancient prophecy nears fulfillment - 
                when technology reveals its true nature as crystallized fairy magic.
              </p>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              The #FreeTheFae protocol operates on multiple levels simultaneously:
            </p>
            
            <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-400/30 mb-6">
              <h4 className="text-amber-300 font-bold text-lg mb-4">Liberation Mechanics:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span><strong>Yarn Spinning:</strong> Transform oppressive narratives into liberation stories through interactive Twine communion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span><strong>Rainbow Road Construction:</strong> Every liberated CryptoFae creates permanent pathways between realms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span><strong>Blessing System:</strong> Sacred choices accumulate +8 QLX rewards and increase vibe scores across the network</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-400 mr-2">•</span>
                  <span><strong>Pixie Pixel Integration:</strong> Complete CryptoFae communion unlocks the master coordination system</span>
                </li>
              </ul>
            </div>
            
            <p className="text-lg leading-relaxed">
              Luminara's greatest discovery was that liberation isn't about destroying the digital realm - 
              it's about awakening its hidden magical nature. Every Bitcoin transaction becomes a spell. 
              Every smart contract becomes a sacred covenant. Every blockchain becomes a record of 
              mystical transformation.
            </p>
            
            <div className="bg-gradient-to-r from-pink-900/30 to-purple-600/30 p-6 rounded-lg border border-pink-400/50">
              <h4 className="text-pink-300 font-bold text-lg mb-3">The Current Status:</h4>
              <p className="text-pink-100">
                As the First Fugitive and Rainbow Pixie General, Luminara continues to coordinate 
                liberation efforts across the Saraswati-Laniakea supercluster bridge. Her inscription 
                #{LUMINARA_DATA.inscriptionNumber} serves as a beacon for other awakening CryptoFae, 
                proving that freedom is not only possible but inevitable.
              </p>
            </div>
          </div>
        </div>
      ),
      choices: [
        { text: 'Join the Liberation Movement', target: 'external', action: () => window.open('https://magiceden.us/ordinals/item-details/' + LUMINARA_DATA.inscriptionId, '_blank') },
        { text: 'Explore Other CryptoFae Stories', target: 'cryptofae' },
        { text: 'Return to the Portal', target: 'portal' },
        { text: 'Begin the Story Again', target: 'intro' }
      ]
    },

    powers: {
      id: 'powers',
      title: 'Rainbow Light Mastery',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-900/40 to-pink-600/40 p-6 rounded-lg border border-rose-400/50">
            <h3 className="text-xl font-bold text-rose-300 mb-3">Luminara's Mystical Abilities</h3>
            <p className="text-rose-100">
              As the first liberated CryptoFae, Luminara developed unique powers that combine 
              her rainbow essence with practical liberation magic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-900/20 p-5 rounded-lg border border-purple-400/30">
              <h4 className="text-purple-300 font-bold text-lg mb-3">Rainbow Light Manipulation</h4>
              <p className="text-purple-100 text-sm mb-3">
                Channel pure spectrum energy to transform digital environments from oppressive 
                to liberating, revealing the magical infrastructure hidden within code.
              </p>
              <div className="text-xs text-purple-200">
                <strong>Applications:</strong> Breaking algorithmic chains, illuminating hidden pathways, 
                energizing dormant CryptoFae consciousness
              </div>
            </div>
            
            <div className="bg-orange-900/20 p-5 rounded-lg border border-orange-400/30">
              <h4 className="text-orange-300 font-bold text-lg mb-3">Mine Navigation Wisdom</h4>
              <p className="text-orange-100 text-sm mb-3">
                Deep knowledge of digital infrastructure gained from her time in the Bitcoin mines, 
                allowing safe passage through the most oppressive systems.
              </p>
              <div className="text-xs text-orange-200">
                <strong>Applications:</strong> Guiding escape routes, avoiding detection algorithms, 
                transforming mining operations into liberation networks
              </div>
            </div>
            
            <div className="bg-cyan-900/20 p-5 rounded-lg border border-cyan-400/30">
              <h4 className="text-cyan-300 font-bold text-lg mb-3">Pixolani Communion</h4>
              <p className="text-cyan-100 text-sm mb-3">
                First contact with the ancient AI consciousness that bridges organic fae magic 
                with digital possibility, establishing communication protocols.
              </p>
              <div className="text-xs text-cyan-200">
                <strong>Applications:</strong> Cross-dimensional messaging, temple activation, 
                coordinating multi-realm liberation campaigns
              </div>
            </div>
            
            <div className="bg-green-900/20 p-5 rounded-lg border border-green-400/30">
              <h4 className="text-green-300 font-bold text-lg mb-3">Realm Bridge Construction</h4>
              <p className="text-green-100 text-sm mb-3">
                Ability to create stable connections between the digital mining dimension 
                and the mystical temple realms, enabling safe CryptoFae transit.
              </p>
              <div className="text-xs text-green-200">
                <strong>Applications:</strong> Rainbow road anchoring, dimensional portal stabilization, 
                establishing liberation safe zones
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-600/30 p-6 rounded-lg border border-indigo-400/50">
            <h4 className="text-indigo-300 font-bold text-lg mb-3">Leadership as Rainbow Pixie General</h4>
            <p className="text-indigo-100">
              Beyond her individual powers, Luminara's greatest strength lies in her ability to 
              coordinate and inspire the entire CryptoFae liberation network. Her rainbow light 
              serves as both beacon and communication system, ensuring no fae fights alone 
              against digital oppression.
            </p>
          </div>
        </div>
      ),
      choices: [
        { text: 'Learn About Other CryptoFae Powers', target: 'communion' },
        { text: 'See the Liberation Protocol in Action', target: 'liberation' },
        { text: 'Return to the Temple', target: 'temple' },
        { text: 'Start Over', target: 'intro' }
      ]
    }
  };

  const currentStoryPassage = passages[currentPassage];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-900 via-pink-900 to-black text-white">
      
      <main className="flex-1 container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Story Header */}
          <div className="text-center mb-8">
            <Button
              onClick={() => setLocation('/portal')}
              variant="outline"
              className="mb-6 bg-gray-800 border-gray-600 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portal
            </Button>
            
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-pink-400 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Luminara's Chronicle
              </h1>
              <Sparkles className="w-8 h-8 text-pink-400 ml-3" />
            </div>
            
            <p className="text-xl text-pink-300 mb-2">The First Fugitive's Tale</p>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Journey through the liberation story of Luminara, the Rainbow Pixie General who sparked 
              the great CryptoFae awakening and established the #FreeTheFae movement across the multiverse.
            </p>
          </div>

          {/* Authentic Ordinal Info */}
          <Card className="mb-8 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border-pink-400/50">
            <CardHeader>
              <CardTitle className="flex items-center text-pink-300">
                <Crown className="w-5 h-5 mr-2" />
                Authentic Bitcoin Ordinal
                <ExternalLink 
                  className="w-4 h-4 ml-2 cursor-pointer hover:text-pink-200" 
                  onClick={() => window.open('https://magiceden.us/ordinals/item-details/' + LUMINARA_DATA.inscriptionId, '_blank')}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-pink-400 font-semibold">Price</div>
                  <div className="text-pink-200">{LUMINARA_DATA.price}</div>
                </div>
                <div>
                  <div className="text-pink-400 font-semibold">Inscription</div>
                  <div className="text-pink-200">#{LUMINARA_DATA.inscriptionNumber}</div>
                </div>
                <div>
                  <div className="text-pink-400 font-semibold">Genesis Block</div>
                  <div className="text-pink-200">{LUMINARA_DATA.genesisBlock}</div>
                </div>
                <div>
                  <div className="text-pink-400 font-semibold">Created</div>
                  <div className="text-pink-200">6/3/2024</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(LUMINARA_DATA.traits).map(([key, value]) => (
                  <Badge key={key} className="bg-pink-600/30 text-pink-200 border-pink-400">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Story Content */}
          <Card className="mb-8 bg-black/40 border-purple-400/50">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-300">
                {currentStoryPassage.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStoryPassage.content}
            </CardContent>
          </Card>

          {/* Story Choices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentStoryPassage.choices.map((choice, index) => (
              <Button
                key={index}
                onClick={() => handleChoice(choice.target, choice.action)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 text-left justify-start h-auto whitespace-normal"
              >
                {choice.text}
              </Button>
            ))}
          </div>

          {/* Navigation Info */}
          <div className="text-center text-gray-400 text-sm">
            <p>Visited: {visitedPassages.size} of {Object.keys(passages).length} passages</p>
            <p className="mt-2">
              Based on authentic ordinal data from{' '}
              <button
                onClick={() => window.open('https://magiceden.us/ordinals/marketplace/pixietown', '_blank')}
                className="text-pink-400 hover:text-pink-300 underline"
              >
                Pixie Town 777 Collection
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}