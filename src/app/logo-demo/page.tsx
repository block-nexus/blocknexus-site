import Image from 'next/image';

export default function LogoDemoPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="mb-12 text-center text-4xl font-bold text-slate-50">
          Logo Shimmer Effect Iterations
        </h1>
        
        <div className="space-y-16">
          {/* Iteration 1 */}
          <div className="card-surface p-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-50">
              Iteration 1: Continuous Color Shift
            </h2>
            <p className="mb-6 text-slate-400">
              Smooth, continuous color shift from orange to blue/teal. Animation speeds up on hover.
            </p>
            <div className="logo-shimmer-1">
              <Image
                src="/block-nexus-logo.png"
                alt="Block Nexus - Iteration 1"
                width={180}
                height={40}
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Iteration 2 */}
          <div className="card-surface p-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-50">
              Iteration 2: Gradient Overlay Shimmer
            </h2>
            <p className="mb-6 text-slate-400">
              Subtle gradient overlay that sweeps across on hover. More dramatic effect when you interact.
            </p>
            <div className="logo-shimmer-2">
              <Image
                src="/block-nexus-logo.png"
                alt="Block Nexus - Iteration 2"
                width={180}
                height={40}
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Iteration 3 */}
          <div className="card-surface p-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-50">
              Iteration 3: Pulsing Multi-Color Shift
            </h2>
            <p className="mb-6 text-slate-400">
              Cycles through multiple colors (orange → yellow → blue → purple) continuously. More intense on hover.
            </p>
            <div className="logo-shimmer-3">
              <Image
                src="/block-nexus-logo.png"
                alt="Block Nexus - Iteration 3"
                width={180}
                height={40}
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Iteration 4 */}
          <div className="card-surface p-8">
            <h2 className="mb-4 text-2xl font-semibold text-slate-50">
              Iteration 4: Subtle Continuous Shift
            </h2>
            <p className="mb-6 text-slate-400">
              Gentle, slow color shift from orange to blue/teal. Stronger effect on hover. Most subtle option.
            </p>
            <div className="logo-shimmer-4">
              <Image
                src="/block-nexus-logo.png"
                alt="Block Nexus - Iteration 4"
                width={180}
                height={40}
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-400">
            Hover over each logo to see the enhanced hover effect
          </p>
        </div>
      </div>
    </div>
  );
}
