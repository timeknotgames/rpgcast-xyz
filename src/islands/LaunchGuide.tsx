import { useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { TEK8_GUILDS } from '../lib/tek8-guilds';
import { PETALS, POSITIONS } from '../lib/tek8-roads';
import { GAME_ROLES } from '../lib/config';
import WalletProvider from './WalletProvider';

// Use our own API proxy to avoid CORS issues with PumpPortal
const PUMP_API = '/api/pump';

function LaunchGuideInner() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdMint, setCreatedMint] = useState('');

  // Token creation form
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenImage, setTokenImage] = useState<File | null>(null);
  const [tokenImagePreview, setTokenImagePreview] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [website, setWebsite] = useState('');
  const [initialBuy, setInitialBuy] = useState('0');

  // Game attributes
  const [tek8Guild, setTek8Guild] = useState('');
  const [rainbowRoad, setRainbowRoad] = useState('');
  const [gameRole, setGameRole] = useState('general');
  const [nationName, setNationName] = useState('');

  // Generate road options based on selected guild
  const roadOptions = tek8Guild
    ? Object.keys(POSITIONS).map(pos => ({
        id: `${tek8Guild}${pos}`,
        name: `${PETALS[tek8Guild]?.element || ''} ${POSITIONS[pos as keyof typeof POSITIONS].name}`,
      }))
    : [];

  // Compress image to meet PumpPortal's size limits (max ~1MB)
  const compressImage = async (file: File, maxSizeKB: number = 500): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Scale down if too large (max 800px on longest side)
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Start with quality 0.8 and reduce if needed
        let quality = 0.8;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not compress image'));
                return;
              }

              if (blob.size > maxSizeKB * 1024 && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };
        tryCompress();
      };

      img.onerror = () => reject(new Error('Could not load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setTokenImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Compress if needed (PumpPortal limit is ~1MB)
      if (file.size > 500 * 1024) {
        try {
          const compressed = await compressImage(file, 500);
          setTokenImage(compressed);
          console.log(`Image compressed: ${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB`);
        } catch (err) {
          console.warn('Could not compress image, using original');
          setTokenImage(file);
        }
      } else {
        setTokenImage(file);
      }
    }
  }, []);

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    if (!tokenName || !tokenSymbol || !tokenDescription) {
      setError('Please fill in all required fields');
      return;
    }

    if (!tek8Guild) {
      setError('Please select a TEK8 guild');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Generate a new mint keypair
      const mintKeypair = Keypair.generate();

      // Step 1: Upload metadata to IPFS via PumpPortal
      const formData = new FormData();
      formData.append('name', tokenName);
      formData.append('symbol', tokenSymbol.toUpperCase());
      formData.append('description', tokenDescription);
      formData.append('showName', 'true');
      if (twitter) formData.append('twitter', twitter);
      if (telegram) formData.append('telegram', telegram);
      if (website) formData.append('website', website);
      if (tokenImage) {
        formData.append('file', tokenImage);
      }

      const ipfsRes = await fetch(`${PUMP_API}/ipfs`, {
        method: 'POST',
        body: formData,
      });

      if (!ipfsRes.ok) {
        const errText = await ipfsRes.text();
        throw new Error(`Failed to upload metadata: ${errText}`);
      }

      const { metadataUri } = await ipfsRes.json();

      // Step 2: Create the token transaction via our proxy
      const createRes = await fetch(`${PUMP_API}/trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          action: 'create',
          tokenMetadata: {
            name: tokenName,
            symbol: tokenSymbol.toUpperCase(),
            uri: metadataUri,
          },
          mint: mintKeypair.publicKey.toBase58(),
          denominatedInSol: 'true',
          amount: parseFloat(initialBuy) || 0,
          slippage: 10,
          priorityFee: 0.0005,
          pool: 'pump',
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        throw new Error(`Failed to create transaction: ${errText}`);
      }

      // Check content type - PumpPortal should return binary
      const contentType = createRes.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await createRes.json();
        throw new Error(`PumpPortal error: ${JSON.stringify(errorData)}`);
      }

      // Step 3: Sign and send the transaction
      const txData = await createRes.arrayBuffer();
      if (txData.byteLength < 100) {
        // Too small to be a valid transaction - probably an error
        const decoder = new TextDecoder();
        throw new Error(`Invalid transaction data: ${decoder.decode(txData)}`);
      }

      const tx = VersionedTransaction.deserialize(new Uint8Array(txData));

      // Sign with mint keypair first
      tx.sign([mintKeypair]);

      // Then sign with user wallet
      const signedTx = await signTransaction(tx);

      // Send the transaction with skipPreflight to avoid simulation errors
      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: true,  // Skip preflight to avoid 403 from simulation
        maxRetries: 5,
        preflightCommitment: 'confirmed',
      });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      // Step 4: Register with rpgcast.xyz database
      const registerRes = await fetch('/api/tokens/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mintAddress: mintKeypair.publicKey.toBase58(),
          creatorWallet: publicKey.toBase58(),
          tek8Guild,
          rainbowRoad,
          gameRole,
          nationName: gameRole === 'nation' ? nationName : undefined,
          name: tokenName,
          symbol: tokenSymbol.toUpperCase(),
          description: tokenDescription,
          imageUrl: metadataUri,
          signature,
        }),
      });

      const registerData = await registerRes.json();
      if (!registerData.success) {
        console.warn('Registration warning:', registerData.error);
      }

      setCreatedMint(mintKeypair.publicKey.toBase58());
      setSuccess(true);
    } catch (err: any) {
      console.error('Token creation error:', err);
      setError(err.message || 'Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Token Created!</h2>
        <p className="text-gray-400 mb-4">
          Your token <span className="text-purple-400 font-mono">{tokenSymbol}</span> is now live on pump.fun!
        </p>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-1">Mint Address</p>
          <p className="font-mono text-sm break-all text-white">{createdMint}</p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href={`https://pump.fun/${createdMint}`}
            target="_blank"
            className="btn btn-gold"
          >
            View on pump.fun
          </a>
          <a href="/discover" className="btn btn-primary">
            View Discovery
          </a>
          <button
            onClick={() => {
              setSuccess(false);
              setStep(1);
              setTokenName('');
              setTokenSymbol('');
              setTokenDescription('');
              setTokenImage(null);
              setTokenImagePreview('');
              setCreatedMint('');
            }}
            className="btn btn-secondary"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Token Details */}
      <div className={`card ${step === 1 ? 'border-purple-500/50' : 'opacity-60'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            step > 1 ? 'bg-green-600' : step === 1 ? 'bg-purple-600' : 'bg-gray-700'
          }`}>
            {step > 1 ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-white font-bold">1</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Token Details</h3>
            <p className="text-gray-400 text-sm mb-4">
              Define your token's identity. This will be visible on pump.fun and in the Quillverse.
            </p>
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Token Name *</label>
                    <input
                      type="text"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="e.g., Dragon Kingdom"
                      className="input"
                      maxLength={32}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Symbol *</label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., DRGN"
                      className="input"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Description *</label>
                  <textarea
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                    placeholder="Describe your token and its role in the Quillverse..."
                    className="input min-h-[100px]"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Token Image</label>
                  <div className="flex items-center gap-4">
                    {tokenImagePreview ? (
                      <img
                        src={tokenImagePreview}
                        alt="Token preview"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-gray-400"
                      />
                      {tokenImage && (
                        <p className="text-xs text-gray-500 mt-1">
                          {(tokenImage.size / 1024).toFixed(0)} KB
                          {tokenImage.size > 500 * 1024 && ' (will be compressed)'}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Images are automatically compressed. PNG, JPG, GIF supported.
                  </p>
                </div>

                {/* Optional social links */}
                <details className="cursor-pointer">
                  <summary className="text-sm text-gray-400 hover:text-gray-300">
                    + Add social links (optional)
                  </summary>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Twitter</label>
                      <input
                        type="text"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="https://twitter.com/..."
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Telegram</label>
                      <input
                        type="text"
                        value={telegram}
                        onChange={(e) => setTelegram(e.target.value)}
                        placeholder="https://t.me/..."
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Website</label>
                      <input
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://..."
                        className="input text-sm"
                      />
                    </div>
                  </div>
                </details>

                <button
                  onClick={() => setStep(2)}
                  disabled={!tokenName || !tokenSymbol || !tokenDescription}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 2: Game Attributes */}
      <div className={`card ${step === 2 ? 'border-purple-500/50' : step > 2 ? '' : 'opacity-60'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            step > 2 ? 'bg-green-600' : step === 2 ? 'bg-purple-600' : 'bg-gray-700'
          }`}>
            {step > 2 ? (
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-white font-bold">2</span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Game Attributes</h3>
            <p className="text-gray-400 text-sm mb-4">
              Align your token with the Quillverse by selecting a TEK8 guild and Rainbow Road.
            </p>
            {step === 2 && (
              <div className="space-y-4">
                {/* TEK8 Guild */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">TEK8 Guild *</label>
                  <select
                    value={tek8Guild}
                    onChange={(e) => { setTek8Guild(e.target.value); setRainbowRoad(''); }}
                    className="input"
                  >
                    <option value="">Select a guild...</option>
                    {TEK8_GUILDS.map(guild => (
                      <option key={guild.id} value={guild.id}>
                        {guild.dice} - {guild.element}: {guild.name}
                      </option>
                    ))}
                  </select>
                  {tek8Guild && (
                    <p className="text-xs text-gray-500 mt-1">
                      {TEK8_GUILDS.find(g => g.id === tek8Guild)?.description}
                    </p>
                  )}
                </div>

                {/* Rainbow Road */}
                {tek8Guild && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Rainbow Road (Optional)</label>
                    <select
                      value={rainbowRoad}
                      onChange={(e) => setRainbowRoad(e.target.value)}
                      className="input"
                    >
                      <option value="">No specific road</option>
                      {roadOptions.map(road => (
                        <option key={road.id} value={road.id}>{road.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Game Role */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Game Role</label>
                  <select
                    value={gameRole}
                    onChange={(e) => setGameRole(e.target.value)}
                    className="input"
                  >
                    {GAME_ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                {/* Nation Name (if nation token) */}
                {gameRole === 'nation' && (
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Nation Name *</label>
                    <input
                      type="text"
                      value={nationName}
                      onChange={(e) => setNationName(e.target.value)}
                      placeholder="Enter your nation's name..."
                      className="input"
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="btn btn-secondary">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!tek8Guild || (gameRole === 'nation' && !nationName)}
                    className="btn btn-primary"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 3: Launch */}
      <div className={`card ${step === 3 ? 'border-purple-500/50' : 'opacity-60'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            step === 3 ? 'bg-purple-600' : 'bg-gray-700'
          }`}>
            <span className="text-white font-bold">3</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Launch Token</h3>
            <p className="text-gray-400 text-sm mb-4">
              Connect your wallet and launch your token directly on pump.fun.
            </p>
            {step === 3 && (
              <div className="space-y-4">
                {/* Wallet Connection */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Connect Wallet</label>
                  <WalletMultiButton />
                </div>

                {publicKey && (
                  <>
                    {/* Initial Buy (Optional) */}
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Initial Buy Amount (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={initialBuy}
                          onChange={(e) => setInitialBuy(e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.1"
                          className="input w-32"
                        />
                        <span className="text-gray-400">SOL</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Optionally buy tokens immediately after creation (recommended for price support)
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium mb-3">Launch Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Token</p>
                          <p className="text-white">{tokenName} ({tokenSymbol})</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Guild</p>
                          <p className="text-white">{TEK8_GUILDS.find(g => g.id === tek8Guild)?.element}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Road</p>
                          <p className="text-white">{rainbowRoad || 'None'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Role</p>
                          <p className="text-white">{GAME_ROLES.find(r => r.id === gameRole)?.name}</p>
                        </div>
                        {nationName && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Nation</p>
                            <p className="text-white">{nationName}</p>
                          </div>
                        )}
                        {parseFloat(initialBuy) > 0 && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Initial Buy</p>
                            <p className="text-white">{initialBuy} SOL</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cost Info */}
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                      <p className="text-yellow-200 text-sm">
                        <strong>Cost:</strong> ~0.02 SOL (pump.fun fee + transaction fees)
                        {parseFloat(initialBuy) > 0 && ` + ${initialBuy} SOL initial buy`}
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button onClick={() => setStep(2)} className="btn btn-secondary">
                        Back
                      </button>
                      <button
                        onClick={handleCreateToken}
                        disabled={loading}
                        className="btn btn-gold flex-1"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating Token...
                          </span>
                        ) : (
                          'Launch on pump.fun'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LaunchGuide() {
  return (
    <WalletProvider>
      <LaunchGuideInner />
    </WalletProvider>
  );
}
