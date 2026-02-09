import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction } from '@solana/web3.js';
import WalletProvider from './WalletProvider';

// Use our own API proxy to avoid CORS issues with PumpPortal
const PUMP_API = '/api/pump';

interface TradeWidgetProps {
  mint: string;
  tokenName: string;
  tokenSymbol: string;
}

function TradeWidgetInner({ mint, tokenName, tokenSymbol }: TradeWidgetProps) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('0.1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slippage, setSlippage] = useState('10');

  const handleTrade = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Create trade transaction via our proxy
      const res = await fetch(`${PUMP_API}/trade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          action,
          mint,
          denominatedInSol: action === 'buy' ? 'true' : 'false',
          amount: amountNum,
          slippage: parseInt(slippage),
          priorityFee: 0.0005,
          pool: 'pump',
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Trade failed: ${errText}`);
      }

      // Sign and send transaction
      const txData = await res.arrayBuffer();
      const tx = VersionedTransaction.deserialize(new Uint8Array(txData));
      const signedTx = await signTransaction(tx);

      const signature = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      setSuccess(`${action === 'buy' ? 'Bought' : 'Sold'} successfully! Tx: ${signature.slice(0, 8)}...`);
      setAmount('0.1');
    } catch (err: any) {
      console.error('Trade error:', err);
      setError(err.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-bold mb-4">Trade {tokenSymbol}</h3>

      {!publicKey ? (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm mb-3">Connect wallet to trade</p>
          <WalletMultiButton />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Buy/Sell Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-600">
            <button
              onClick={() => setAction('buy')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                action === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setAction('sell')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                action === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Amount ({action === 'buy' ? 'SOL' : tokenSymbol})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.1"
              min="0"
              step="0.01"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>

          {/* Quick Amounts */}
          <div className="flex gap-2">
            {action === 'buy' ? (
              <>
                <button
                  onClick={() => setAmount('0.1')}
                  className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                >
                  0.1 SOL
                </button>
                <button
                  onClick={() => setAmount('0.5')}
                  className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                >
                  0.5 SOL
                </button>
                <button
                  onClick={() => setAmount('1')}
                  className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                >
                  1 SOL
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setAmount('25')}
                  className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                >
                  25%
                </button>
                <button
                  onClick={() => setAmount('50')}
                  className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                >
                  50%
                </button>
                <button
                  onClick={() => setAmount('100')}
                  className="flex-1 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600"
                >
                  100%
                </button>
              </>
            )}
          </div>

          {/* Slippage */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Slippage (%)</label>
            <select
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
            </select>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-2">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-2">
              <p className="text-green-400 text-xs">{success}</p>
            </div>
          )}

          {/* Trade Button */}
          <button
            onClick={handleTrade}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              action === 'buy'
                ? 'bg-green-600 hover:bg-green-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              `${action === 'buy' ? 'Buy' : 'Sell'} ${tokenSymbol}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Trades execute on pump.fun via PumpPortal
          </p>
        </div>
      )}
    </div>
  );
}

export default function TradeWidget(props: TradeWidgetProps) {
  return (
    <WalletProvider>
      <TradeWidgetInner {...props} />
    </WalletProvider>
  );
}
